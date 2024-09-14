from wagtail.snippets.views.snippets import SnippetViewSetGroup
from .models import InstrumentSnippetViewSet, BandSnippetViewSet, BandPackageSnippetViewSet,  LessonPackageSnippetViewSet, LessonSnippetViewSet

from wagtail.snippets.models import register_snippet
# Define the custom Menu class for the "Band" submen

from django.utils.html import format_html
from django.templatetags.static import static

from wagtail import hooks


class ProdCatMenuGroup(SnippetViewSetGroup):
    menu_label = "Bands"
    menu_icon = "media"  # change as required
    menu_order = 50  # will put in 3rd place (000 being 1st, 100 2nd)
    items = (

        BandPackageSnippetViewSet,
        BandSnippetViewSet,
        InstrumentSnippetViewSet,

        LessonPackageSnippetViewSet,
        LessonSnippetViewSet,



    )


register_snippet(ProdCatMenuGroup)
