from django.db import models
from wagtail import hooks
from django.middleware.csrf import get_token
from wagtail.snippets.views.snippets import SnippetViewSet
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from wagtail.images.models import Image
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.images.models import Image
from inertia import render
from django.core.exceptions import ValidationError
from wagtail.admin.menu import SubmenuMenuItem, MenuItem
from django.db import models
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from wagtail.snippets.models import register_snippet
from wagtail.admin.panels import FieldPanel
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting


@register_setting
class PaymentSettings(BaseSiteSetting):
    stripe_id = models.CharField(max_length=255, help_text="Your Stripe ID")
    success_url = models.URLField(
        help_text="The URL to redirect to after a successful payment", null=True, blank=True)
    cancel_url = models.URLField(
        help_text="The URL to redirect to if the payment is canceled", null=True, blank=True)

    panels = [
        FieldPanel('stripe_id'),
        FieldPanel('success_url'),
        FieldPanel('cancel_url'),
    ]


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


class TermSnippetViewSet(SnippetViewSet):
    model = Term
    menu_label = "Terms"
    icon = "date"


class MemberManager(models.Manager):
    def for_user(self, user):
        return self.filter(user=user)


class Member(models.Model):
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
        ('PREFERNOTSAY', 'Prefer Not Say')
    ]
    ETHNICITY_CHOICES = [
        ('prefer_not_say', 'Prefer Not Say'),
        ('indian', 'Indian'),
        ('pakistani', 'Pakistani'),
        ('bangladeshi', 'Bangladeshi'),
        ('chinese', 'Chinese'),
        ('any_other_asian_background', 'Any other Asian background'),
        ('caribbean', 'Caribbean'),
        ('african', 'African'),
        ('any_other_black_black_british_or_caribbean_background',
         'Any other Black, Black British, or Caribbean background'),
        ('white_and_black_caribbean', 'White and Black Caribbean'),
        ('white_and_black_african', 'White and Black African'),
        ('white_and_asian', 'White and Asian'),
        ('white_english_welsh_scottish_northern_irish_or_british',
         'White - English, Welsh, Scottish, Northern Irish or British'),
        ('white_irish', 'White - Irish'),
        ('white_gypsy_or_irish_traveller', 'White - Gypsy or Irish Traveller'),
        ('white_roma', 'White - Roma'),
        ('any_other_white_background', 'Any other White background'),
        ('arab', 'Arab'),
        ('any_other_ethnic_group', 'Any other ethnic group'),
    ]

    siblings = models.BooleanField(default=False)  # New field added

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='members')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=12,
        choices=GENDER_CHOICES,
        default='OTHER',
        help_text="The member's sex at birth"
    )
    ethnicity = models.CharField(
        max_length=54,
        choices=ETHNICITY_CHOICES,
        default='Prefer Not Say',
        help_text="The member's ethnicity"
    )
    panels = [
        FieldPanel('user'),
        FieldPanel('first_name'),
        FieldPanel('last_name'),
        FieldPanel('date_of_birth'),
        FieldPanel('gender'),
        FieldPanel('ethnicity'),
        FieldPanel('siblings'),

        # InlinePanel('enrolments', label="Enrolments"),  # Add this line
    ]

    objects = MemberManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class MemberSnippetViewSet(SnippetViewSet):
    model = Member
    menu_label = "Members"
    icon = "user"
    list_display = ["user", "first_name", "last_name",
                    "ethnicity", "date_of_birth", "gender", "siblings"]
    search_fields = ["first_name", "last_name", "ethnicity"]
    list_filter = ["ethnicity", "gender"]


class Enrolment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    ]
    member = models.ForeignKey(
        Member, on_delete=models.CASCADE, related_name='enrolments')
    term = models.ForeignKey(
        Term, on_delete=models.CASCADE, related_name='enrolments')
    enrolment_date = models.DateField(auto_now_add=True)
    status = models.CharField(
        max_length=7,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="The payment status of the enrolment"
    )

    panels = [
        FieldPanel('member'),
        FieldPanel('term'),
        FieldPanel('status'),
    ]

    def __str__(self):
        return f"{self.member.full_name} - {self.term.name}"

    class Meta:
        unique_together = ('member', 'term')
        ordering = ['-enrolment_date']


class EnrolmentSnippetViewSet(SnippetViewSet):
    model = Enrolment
    menu_label = "Enrolments"
    icon = "doc-full"


#
#  PAGE TYPES
#

class ELCBPage(Page):

    subpage_types = None

    class Meta:
        abstract = True

    def clean(self):
        super().clean()
        if not self.pk and self.__class__.objects.exists():
            raise ValidationError(
                f"A {self.__class__.__name__} instance already exists.")

    def get_context(self, request):
        context = super().get_context(request)
        context['csrf_token'] = get_token(request)

        # Add additional context common to all ELCB pages here
        if request.user.is_authenticated:
            user_data = {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'groups':  request.user.groups.all()

                # Add other fields as needed
            }
            # Get all members associated with the current user
            members = Member.objects.for_user(request.user)
            context['members'] = members

            # load details of primary member
            primary_member = Member.objects.for_user(request.user)
            context['member'] = {
                'forename': primary_member[0].first_name,
                'surname': primary_member[0].last_name,
                'dateOfBirth': primary_member[0].date_of_birth,
                'gender': primary_member[0].gender,
                'ethnicity': primary_member[0].get_ethnicity_display(),
                'siblings': primary_member[0].siblings}
            context['userdata'] = {'custom:memberid': primary_member[0].id}
        else:
            user_data = None
            context['member'] = None

        context['user'] = user_data

        # Set the current term in the context
        current_term = Term.get_current_term()
        context['currentterm'] = {'term': current_term}

        return context

    def serve(self, request):
        context = self.get_context(request)
        del context['request']
        return render(request, self.react_module_name, context)

    def serve_preview(self, request, mode_name):
        return self.serve(request)


class SignUpPage(ELCBPage):

    react_module_name = "SignUp"

    welcome_message = RichTextField(
        blank=True,
        help_text="Enter a welcome message to greet visitors."
    )

    content_panels = Page.content_panels + [

        FieldPanel('welcome_message'),
    ]

    class Meta:
        verbose_name = "SignUp Page"

    def get_context(self, request):
        # Get the default context from the parent class
        context = super().get_context(request)
        context['welcome_message'] = self.welcome_message
        return context


class SignInPage(ELCBPage):

    react_module_name = "SignIn"

    class Meta:
        verbose_name = "SignIn Page"

    def get_context(self, request):
        # Get the default context from the parent class
        context = super().get_context(request)
        # future
        return context


class SignOutPage(ELCBPage):

    react_module_name = "SignOut"

    class Meta:
        verbose_name = "SignOut Page"

    def get_context(self, request):
        # Get the default context from the parent class
        context = super().get_context(request)
        # future
        return context


class EnrolmentPage(ELCBPage):

    react_module_name = "NewMemberLanding"

    class Meta:
        verbose_name = "Enrolment Page"

    def get_context(self, request):
        # Get the default context from the parent class
        context = super().get_context(request)

        # Add the user object to the context
        if request.user.is_authenticated:
            # Get enrollments for each member in the current term
            enrolment = None
            current_term = context['currentterm']['term']
            if current_term:
                enrolment = Enrolment.objects.filter(
                    member=context['members'][0], term=current_term).first()

            context['currentEnrolment'] = enrolment
        else:
            context['currentEnrolment'] = None

        context['prodCat'] = {
            "products": {
                "bands": {
                    "name": "Bands",
                    "options": {
                        "none": {
                            "description": "No Bands (Lessons Only)",
                            "id": "none",
                            "price": 0,
                            "available": True
                        },
                        "small": {
                            "description": "One Small Band Only",
                            "features": {
                                "includes": "one",
                                "options": [
                                    {
                                        "description": "Percussion",
                                        "instruments": [
                                            "Snare drum",
                                            "Bass drum",
                                            "Tenor drum",
                                            "Cymbals",
                                            "Bongos",
                                            "Congas",
                                            "Drum set",
                                            "Tambourine",
                                            "Timpani",
                                            "Timbales",
                                            "Tom-toms",
                                            "Tam-tam",
                                            "Xylophone",
                                            "Marimba",
                                            "Crotales",
                                            "Vibraphone",
                                            "Glockenspiel",
                                            "Chimes",
                                            "Wind chimes",
                                            "Triangle",
                                            "Wood blocks/temple blocks",
                                            "Maracas",
                                            "Claves",
                                            "Anvil",
                                            "Vibraslap",
                                            "Rain stick",
                                            "Whip",
                                            "Guiro",
                                            "Finger cymbals",
                                            "Slide whistle",
                                            "Sleigh bells",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Premier Band",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Percussion",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Early Music",
                                        "instruments": [
                                            "Soprano Recorder",
                                            "Alto Recorder",
                                            "Tenor Recorder",
                                            "Bass Recorder",
                                            "Recorder",
                                            "Flute",
                                            "Violin",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Chamber Band",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Percussion",
                                            "Piano",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Jazz Stompers",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Guitar",
                                            "Piano",
                                            "Percussion",
                                            "Bass guitar",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Jazz Combo",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Guitar",
                                            "Piano",
                                            "Percussion",
                                            "Bass guitar",
                                            "Violin",
                                            "Other"
                                        ]
                                    }
                                ]
                            },
                            "id": "small",
                            "price": 58,
                            "available": True
                        },
                        "all": {
                            "description": "All Bands",
                            "features": {
                                "includes": "all",
                                "options": [
                                    {
                                        "description": "Main Band",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Percussion",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Big Band",
                                        "instruments": [
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Guitar",
                                            "Piano",
                                            "Percussion",
                                            "Bass guitar",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Percussion",
                                        "instruments": [
                                            "Snare drum",
                                            "Bass drum",
                                            "Tenor drum",
                                            "Cymbals",
                                            "Bongos",
                                            "Congas",
                                            "Drum set",
                                            "Tambourine",
                                            "Timpani",
                                            "Timbales",
                                            "Tom-toms",
                                            "Tam-tam",
                                            "Xylophone",
                                            "Marimba",
                                            "Crotales",
                                            "Vibraphone",
                                            "Glockenspiel",
                                            "Chimes",
                                            "Wind chimes",
                                            "Triangle",
                                            "Wood blocks/temple blocks",
                                            "Maracas",
                                            "Claves",
                                            "Anvil",
                                            "Vibraslap",
                                            "Rain stick",
                                            "Whip",
                                            "Guiro",
                                            "Finger cymbals",
                                            "Slide whistle",
                                            "Sleigh bells",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Premier Band",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Percussion",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Early Music",
                                        "instruments": [
                                            "Soprano Recorder",
                                            "Alto Recorder",
                                            "Tenor Recorder",
                                            "Bass Recorder",
                                            "Recorder",
                                            "Flute",
                                            "Violin",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Chamber Band",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Percussion",
                                            "Piano",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Jazz Stompers",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Guitar",
                                            "Piano",
                                            "Percussion",
                                            "Bass guitar",
                                            "Other"
                                        ]
                                    },
                                    {
                                        "description": "Jazz Combo",
                                        "instruments": [
                                            "Flute",
                                            "Piccolo",
                                            "Bass clarinet",
                                            "Clarinet in Bb",
                                            "Oboe",
                                            "Bassoon",
                                            "Alto saxophone",
                                            "Baritone saxophone",
                                            "Tenor saxophone",
                                            "Tenor trombone",
                                            "Bass trombone",
                                            "Trumpet/cornet in Bb",
                                            "Alto tenor horn in Eb",
                                            "Horn",
                                            "Euphonium/Baritone horn",
                                            "Tuba",
                                            "Guitar",
                                            "Piano",
                                            "Percussion",
                                            "Bass guitar",
                                            "Violin",
                                            "Other"
                                        ]
                                    }
                                ]
                            },
                            "id": "all",
                            "price": 116,
                            "available": True
                        }
                    }
                },
                "lessons": {
                    "name": "Lessons",
                    "options": {
                        "none": {
                            "description": "No lessons",
                            "id": "none",
                            "price": 0,
                            "available": True
                        },
                        "one": {
                            "description": "One 15 min lesson per week",
                            "id": "one",
                            "price": 116,
                            "available": True
                        },
                        "two": {
                            "description": "Two 15 min lessons per week",
                            "id": "two",
                            "price": 232,
                            "available": True
                        },
                        "three": {
                            "description": "Three 15 min lessons per week",
                            "id": "three",
                            "price": 348,
                            "available": True
                        }
                    }
                }
            },
            "ratesApplied": "full"
        }

        return context


class MemberProfilePage(ELCBPage):

    react_module_name = "NewMemberProfile"

    class Meta:
        verbose_name = "Profile Page"

    def get_context(self, request):
        # Get the default context from the parent class
        context = super().get_context(request)
        # future
        return context


class ELCBHomePage(ELCBPage):
    react_module_name = 'SignIn'

    class Meta:
        verbose_name = "Home Page"
