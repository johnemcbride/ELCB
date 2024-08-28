import json
from pathlib import Path
from django.conf import settings
from django.contrib.contenttypes.models import ContentType

from django.core.management.base import BaseCommand  # Updated path for BaseCommand
from wagtail.models import Page, Site
from wagtail.images.models import Image

from frontend.models import (
    SignUpPage
)

APP_DIR = Path(__file__).resolve().parent.parent.parent
FIXTURES_DIR = APP_DIR.joinpath("fixtures")


class Command(BaseCommand):
    """
    this command is used to create the initial wagtail cms page tree
    """

    help = "creates initial wagtail cms page tree"

    def handle(self, raise_error=False, *args, **options):
        # Create the root SignUp page

        print('Findingg root')
        root_page = Page.get_first_root_node()

        if root_page is None:
            print(
                "No root node found. The Wagtail tree might not be properly initialized.")
        else:
            print("Root node exists.")

        print('F oundroot')
        # Cr      print('Findingg root'eate a landing child page
        landing_page = SignUpPage(title="Landing", slug="")
        landing_page2 = SignUpPage(title="Landing", slug="landing")
        print('Created lp')
        root_page.add_child(instance=landing_page)
        print('added as child of root')
        landing_page.save()
        print('Created landing')

        # Create a signup child page
        signup_page = SignUpPage(title="Sign Up", slug="signup")
        landing_page.add_child(instance=signup_page)
        signout_page = SignUpPage(title="Sign Out", slug="signout")
        landing_page.add_child(instance=signout_page)
        landing_page.add_child(instance=landing_page2)
        signup_page.save()
        print('Created signup')

        # Create a signin child page
        signin_page = SignUpPage(title="Sign In", slug="signin")
        landing_page.add_child(instance=signin_page)
        signin_page.save()
        print('Created signin')

        # Set up the default site
        site = Site.objects.filter(is_default_site=True).first()
        if site:
            site.root_page = landing_page
            site.hostname = 'localhost'
            site.port = 8000
            site.site_name = 'ELCB'
            site.save()
        else:
            Site.objects.create(
                hostname='localhost',
                port=8000,
                root_page=landing_page,
                is_default_site=True,
                site_name='ELCB'
            )

        self.stdout.write(self.style.SUCCESS(
            'Successfully created the root page and child pages, and set up the default site.'))
