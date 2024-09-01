from django.db import models
from wagtail import hooks
from django.middleware.csrf import get_token
from wagtail.snippets.views.snippets import SnippetViewSet
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultipleChooserPanel, MultiFieldPanel
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from wagtail.images.models import Image
from wagtail.models import Page, Orderable
from wagtail.fields import RichTextField

from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey
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


@register_snippet
class MembershipComponent(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    panels = [
        FieldPanel('name'),
        FieldPanel('description'),
    ]

    def __str__(self):
        return self.name


@register_snippet
class PriceTier(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    panels = [
        FieldPanel('name'),
        FieldPanel('description'),
    ]

    def __str__(self):
        return self.name


class MembershipPackageComponent(Orderable):
    package = ParentalKey('MembershipPackage',
                          related_name='components', on_delete=models.CASCADE)
    component = models.ForeignKey(
        MembershipComponent, related_name='+', on_delete=models.CASCADE)

    panels = [
        MultipleChooserPanel('component', chooser_field_name='name'),
    ]


class MembershipPackagePrice(Orderable):
    package = ParentalKey('MembershipPackage',
                          related_name='prices', on_delete=models.CASCADE)
    price_tier = models.ForeignKey(
        PriceTier, related_name='+', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    panels = [
        MultipleChooserPanel('price_tier', chooser_field_name='name'),
        FieldPanel('price'),
    ]


@register_snippet
class MembershipPackage(ClusterableModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    panels = [
        FieldPanel('name'),
        FieldPanel('description'),
        MultiFieldPanel([
            InlinePanel('components', label="Components"),
        ], heading="Membership Components"),
        MultiFieldPanel([
            InlinePanel('prices', label="Price Tiers"),
        ], heading="Price Tiers"),
    ]

    def __str__(self):
        return self.name
