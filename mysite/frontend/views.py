from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from .models import Member, Enrolment, Term, BandPackage, LessonPackage
from django.contrib.auth.models import User
from wagtail.models import Site
import datetime
from inertia import render
import stripe
from django.http import JsonResponse
import json
from .models import PaymentSettings
from django.views.decorators.csrf import csrf_exempt

from django.views.decorators.http import require_POST


def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'detail': 'Authenticated successfully'}, status=200)
        else:
            return JsonResponse({'detail': 'Invalid username or password'}, status=403)

    return JsonResponse({'detail': 'Method not allowed'}, status=405)


@csrf_exempt
@require_POST
def stripe_callback(request):
    print('hi')
    if request.method == 'POST':

        current_site = Site.find_for_request(request)
        site_settings = PaymentSettings.for_site(current_site)
        webhook_secret = site_settings.stripe_webhook_secret
        # Get the Stripe webhook secret

        # Read the incoming payload from Stripe
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            # Verify the payload signature to ensure it's from Stripe
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as e:
            # Invalid payload
            return JsonResponse({'error': str(e)}, status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return JsonResponse({'error': 'Invalid signature'}, status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            customer_reference_id = session['client_reference_id']
            payment_status = session['payment_status']

            if payment_status == 'paid':
                try:
                    # Update the corresponding Enrolment object
                    enrolment = Enrolment.objects.get(
                        id=customer_reference_id)
                    enrolment.status = 'paid'
                    enrolment.save()
                    return JsonResponse({'message': 'Enrolment updated successfully'}, status=200)
                except Enrolment.DoesNotExist:
                    return JsonResponse({'error': 'Enrolment not found'}, status=404)

    return JsonResponse({'status': 'success'}, status=200)


def signup_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            birthdate = data.get('birthdate')
            fore_name = data.get('name')
            family_name = data.get('family_name')
            ethnicity = data.get('ethnicity')
            # Convert the birthdate to YYYY-MM-DD format
            try:
                birthdate = datetime.datetime.strptime(
                    birthdate, '%m/%d/%Y').strftime('%Y-%m-%d')
            except ValueError:
                return JsonResponse({'detail': 'Invalid date format. Please use MM/DD/YYYY.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)

        # Check if the username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'detail': 'Username or email already taken'}, status=409)

        # Create the user
        user = User.objects.create_user(username=username, password=password)

        # create user here
        if user is not None:
            # get associated member and update details
            # Fetch the associated Member object created by the signal
            member = Member.objects.get(user=user)

            # Map the user-friendly ethnicity name to the internal value
            ethnicity_mapping = {label: value for value,
                                 label in Member.ETHNICITY_CHOICES}
            ethnicity_internal_value = ethnicity_mapping.get(ethnicity)

            # Update the Member object with the additional details
            member.date_of_birth = birthdate
            member.first_name = fore_name
            member.last_name = family_name
            member.ethnicity = ethnicity_internal_value
            member.save()
            login(request, user)
            return JsonResponse({'detail': 'User created successfully'}, status=200)
        else:
            return JsonResponse({'detail': 'Invalid username or password'}, status=403)

    return JsonResponse({'detail': 'Method not allowed'}, status=405)


@login_required
def update_member(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request
            data = json.loads(request.body)
            print(data)

            # Get the current user's member object
            member = Member.objects.get(user=request.user)

            # Update member fields if they are present in the request
            if 'dateOfBirth' in data:
                try:
                    member.date_of_birth = datetime.datetime.strptime(
                        data['dateOfBirth'].split('T')[0], '%Y-%m-%d').strftime('%Y-%m-%d')
                except ValueError:
                    return JsonResponse({'detail': 'Invalid date format. Please use MM/DD/YYYY.'}, status=400)

            if 'forename' in data:
                member.first_name = data['forename']

            if 'surname' in data:
                member.last_name = data['surname']

            if 'gender' in data:
                if data['gender'].upper() in dict(Member.GENDER_CHOICES):
                    member.gender = data['gender'].upper()
                else:
                    return JsonResponse({'detail': 'Invalid gender value'}, status=400)

            if 'ethnicity' in data:
                ethnicity_mapping = {
                    label.lower(): value for value, label in Member.ETHNICITY_CHOICES}
                ethnicity_internal_value = ethnicity_mapping.get(
                    data['ethnicity'].lower())
                if ethnicity_internal_value is None:
                    return JsonResponse({'detail': 'Invalid ethnicity value'}, status=400)
                member.ethnicity = ethnicity_internal_value

            if 'siblings' in data:
                member.siblings = data['siblings']

            # Save the updated member object
            member.save()

            return JsonResponse({'detail': 'Member updated successfully'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON'}, status=400)

        except Member.DoesNotExist:
            return JsonResponse({'detail': 'Member not found'}, status=404)

    return JsonResponse({'detail': 'Method not allowed'}, status=405)


def logout_view(request):
    logout(request)
    return render(request, 'SignIn', {})  # or return some Inertia response


@login_required
@require_POST
def checkout(request):

    print('In checkout')
    json_body = json.loads(request.body)

    # receives this
    #
    # {
    #     bands: wizardState.bands,
    #     lessons: wizardState.lessons,
    #     giftAidConsent: wizardState.giftaidconsent ? true : false,
    #     memberEnrolmentsId: state.userdata["custom:memberid"],
    #     instrumentsPlayed: instrumentsPlayed
    #   }
    #
    # 1. get member
    # 2. create enrolment, with status pending
    # 3. create stripe session

    member = Member.objects.get(
        user=User.objects.get(username=request.user))

    print(member)

    #
    #  handle repeat request of enrolment....
    #
    enrolment = Enrolment.objects.create(
        member=member,
        term=Term.get_current_term(),
        status='pending',
        bands=json_body['bands'],
        bandDesc=BandPackage.objects.get(key=json_body['bands']).name,
        bandPrice=BandPackage.objects.get(key=json_body['bands']).fullprice,
        lessons=json_body['lessons'],
        lessonsDesc=LessonPackage.objects.get(key=json_body['lessons']).name,
        lessonsPrice=LessonPackage.objects.get(
            key=json_body['lessons']).fullprice
    )

    # Retrieve the Stripe keys from the Wagtail settings

    print('before getting settings')
    # Retrieve the current site based on the request
    current_site = Site.find_for_request(request)
    site_settings = PaymentSettings.for_site(current_site)
    stripe.api_key = site_settings.stripe_id

    print('Got settings:')
    print(current_site)
    print(site_settings)

    # Create a Stripe Checkout Session
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'gbp',
                'unit_amount': str(int(BandPackage.objects.get(key=json_body['bands']).fullprice*100)),
                'product_data': {'name': BandPackage.objects.get(key=json_body['bands']).name}
            },
            'quantity': 1,
        }, {
            'price_data': {
                'currency': 'gbp',
                'unit_amount': str(int(LessonPackage.objects.get(key=json_body['lessons']).fullprice*100)),
                'product_data': {'name': LessonPackage.objects.get(key=json_body['lessons']).name}
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=site_settings.success_url,
        cancel_url=site_settings.cancel_url,
        client_reference_id=enrolment.id
    )

    # todo - stripe
    return JsonResponse({'url': session.url})
