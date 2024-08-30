from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from wagtail.models import Site
from inertia import render
import stripe
from django.http import JsonResponse
import json
from .models import PaymentSettings

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


def logout_view(request):
    logout(request)
    return render(request, 'SignIn', {})  # or return some Inertia response


@login_required
@require_POST
def checkout(request):
    print(json.dumps(json.load(request)))
    print(request.user)

    # Retrieve the Stripe keys from the Wagtail settings

    # Retrieve the current site based on the request
    current_site = Site.find_for_request(request)
    site_settings = PaymentSettings.for_site(current_site)
    stripe.api_key = site_settings.stripe_id

    # Create a Stripe Checkout Session
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': 'T-shirt',
                },
                'unit_amount': 2000,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=site_settings.success_url,
        cancel_url=site_settings.cancel_url,
    )

    # todo - stripe
    return JsonResponse({'url': session.url})
