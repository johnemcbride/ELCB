from wagtail.snippets.views.snippets import SnippetViewSet, SnippetViewSetGroup
from frontend.models import EnrolmentSnippetViewSet, MemberSnippetViewSet, TermSnippetViewSet
from wagtail.snippets.models import register_snippet
# Define the custom Menu class for the "Band" submen

from django.utils.html import format_html
from django.templatetags.static import static

from wagtail import hooks


@hooks.register('insert_global_admin_css')
def global_admin_css():
    return format_html('<link rel="stylesheet" href="{}">', static('css/wagtail_admin_custom.css'))


@hooks.register('construct_main_menu')
def hide_help_menu(request, menu_items):
    menu_items[:] = [
        item for item in menu_items if item.name not in ('help', 'documents')]


class BandMenuGroup(SnippetViewSetGroup):
    menu_label = "Members"
    menu_icon = "group"  # change as required
    menu_order = 0  # will put in 3rd place (000 being 1st, 100 2nd)
    items = (
        EnrolmentSnippetViewSet,
        MemberSnippetViewSet,
        TermSnippetViewSet,

    )


register_snippet(BandMenuGroup)
