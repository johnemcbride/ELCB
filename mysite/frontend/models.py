from django.db import models
from django.middleware.csrf import get_token

from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from wagtail.images.models import Image
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.images.models import Image
from inertia import render
from django.db import models
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from wagtail.snippets.models import register_snippet
from wagtail.admin.panels import FieldPanel


@register_snippet
class Term(models.Model):
    name = models.CharField(max_length=100)  # e.g., "Fall 2024"
    start_date = models.DateField()
    end_date = models.DateField()

    panels = [
        FieldPanel('name'),
        FieldPanel('start_date'),
        FieldPanel('end_date'),
    ]

    def __str__(self):
        return self.name

    @staticmethod
    def get_current_term():
        today = timezone.now().date()
        try:
            return Term.objects.get(start_date__lte=today, end_date__gte=today)
        except Term.DoesNotExist:
            return None

    class Meta:
        ordering = ['-start_date']


class MemberManager(models.Manager):
    def for_user(self, user):
        return self.filter(user=user)


@register_snippet
class Member(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='members')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)

    panels = [
        FieldPanel('user'),
        FieldPanel('first_name'),
        FieldPanel('last_name'),
        FieldPanel('date_of_birth'),
    ]

    objects = MemberManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


@register_snippet
class Enrolment(models.Model):
    member = models.ForeignKey(
        Member, on_delete=models.CASCADE, related_name='enrolments')
    term = models.ForeignKey(
        Term, on_delete=models.CASCADE, related_name='enrolments')
    enrolment_date = models.DateField(auto_now_add=True)

    panels = [
        FieldPanel('member'),
        FieldPanel('term'),
    ]

    def __str__(self):
        return f"{self.member.full_name} - {self.term.name}"

    class Meta:
        unique_together = ('member', 'term')
        ordering = ['-enrolment_date']


class SignUpPage(Page):

    moduleLookUp = {'signup': "SignUp",
                    'signin': "SignIn",
                    'landing': 'NewMemberLanding',
                    'signout': 'SignOut'

                    }
    logo = models.ForeignKey(
        Image,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Upload a logo image that will be displayed on the page."
    )
    welcome_message = RichTextField(
        blank=True,
        help_text="Enter a welcome message to greet visitors."
    )

    content_panels = Page.content_panels + [
        FieldPanel('logo'),
        FieldPanel('welcome_message'),
    ]

    class Meta:
        verbose_name = "SignUp Page"

    def get_context(self, request):
        # Get the default context from the parent class
        context = super().get_context(request)
        context['csrf_token'] = get_token(request)

        # Set the current term in the context
        current_term = Term.get_current_term()
        # Add the user object to the context
        if request.user.is_authenticated:
            user_data = {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                # Add other fields as needed
            }
            # Get all members associated with the current user
            members = Member.objects.for_user(request.user)
            context['members'] = members

            # Get enrollments for each member in the current term
            enrolments = {}
            if current_term:
                for member in members:
                    enrolment = Enrolment.objects.filter(
                        member=member, term=current_term).first()
                    if enrolment:
                        enrolments[member.id] = enrolment

            context['enrolments'] = enrolments
        else:
            user_data = None

        context['user'] = user_data

        context['current_term'] = current_term

        # Add your custom context data
        slug = self.slug
        module_name = self.moduleLookUp.get(slug)
        context['module_name'] = module_name
        context['welcome_message'] = self.welcome_message

        return context

    def serve(self, request):

        context = self.get_context(request)
        del context['request']
        module_name = context.get('module_name')

        # 'Home' corresponds to your React component
        return render(request, module_name, context)

    def serve_preview(self, request, mode_name):

        return self.serve(request)
