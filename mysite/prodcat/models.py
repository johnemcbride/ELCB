from django.db import models
from wagtail import hooks
from django.middleware.csrf import get_token
from wagtail.snippets.views.snippets import SnippetViewSet
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultipleChooserPanel, MultiFieldPanel, ObjectList, TabbedInterface
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


class Instrument(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),

    ]

    def __str__(self):
        return self.name


class InstrumentSnippetViewSet(SnippetViewSet):
    model = Instrument
    menu_label = "Instruments"
    icon = "cog"
    list_display = ["name"]
    search_fields = ["name"]


class Band(ClusterableModel):
    name = models.CharField(max_length=255)

    content_panels = [
        FieldPanel('name'),

    ]

    # Panels for the "Related Instruments" tab
    related_instruments_panels = [
        InlinePanel('related_instruments',
                    heading="Related Instruments", label="Related Instrument"),
    ]

 # Combine panels into tabs
    edit_handler = TabbedInterface([
        ObjectList(content_panels, heading="Content"),
        ObjectList(related_instruments_panels, heading="Related Instruments"),
    ])

    def __str__(self):
        return self.name

    def instruments(self):
        return " ".join([str(ri.instruments.name) for ri in self.related_instruments.all()])
        # return [str(ri.instruments.name) for ri in self.related_instruments.all()]


class BandSnippetViewSet(SnippetViewSet):
    model = Band
    menu_label = "Bands"
    icon = "cogs"
    list_display = ["name", "instruments"]
    search_fields = ["name"]


class BandRelatedInstrument(Orderable):
    page = ParentalKey(Band, on_delete=models.CASCADE,
                       related_name='related_instruments')
    instruments = models.ForeignKey(
        Instrument, on_delete=models.CASCADE, related_name='+',  null=True, blank=True)

    panels = [
        FieldPanel('instruments'),
    ]


# --

class BandPackage(ClusterableModel):
    name = models.CharField(max_length=255)
    fullprice = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    under30price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    siblingprice = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)

    content_panels = [
        FieldPanel('name'),

    ]

    cost_panels = [
        FieldPanel('fullprice'),
        FieldPanel('under30price'),
        FieldPanel('siblingprice'),

    ]

    # Panels for the "Related Instruments" tab
    related_bands_panels = [
        InlinePanel('related_bands',
                    heading="Related Bands", label="Related Bands"),
    ]

 # Combine panels into tabs
    edit_handler = TabbedInterface([
        ObjectList(content_panels, heading="Content"),
        ObjectList(related_bands_panels, heading="Related Bands"),
        ObjectList(cost_panels, heading="Cost"),
    ])

    def __str__(self):
        return self.name

    def bands(self):
        return " ".join([str(ri.bands.name) for ri in self.related_bands.all()])


class BandPackageSnippetViewSet(SnippetViewSet):
    model = BandPackage
    menu_label = "Band Packages"
    icon = "folder"
    list_display = ["name", "bands", "fullprice",
                    "under30price", "siblingprice"]
    search_fields = ["name"]


class BandPackageRelatedBand(Orderable):
    page = ParentalKey(BandPackage, on_delete=models.CASCADE,
                       related_name='related_bands')
    bands = models.ForeignKey(
        Band, on_delete=models.CASCADE, related_name='+', null=True, blank=True)

    panels = [
        FieldPanel('bands'),
    ]
