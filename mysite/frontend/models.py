from django.db import models

from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from wagtail.images.models import Image
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.images.models import Image
from inertia import render


class SignUpPage(Page):

    moduleLookUp = {'signup': "SignUp",
                    'signin': "SignIn",

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
        print(context)
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
