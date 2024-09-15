import json
from pathlib import Path
from django.conf import settings
from django.contrib.contenttypes.models import ContentType

from django.core.management.base import BaseCommand  # Updated path for BaseCommand
from wagtail.models import Page, Site
from wagtail.contrib.redirects.models import Redirect
from wagtail.images.models import Image

from frontend.models import (
    Term

)

from prodcat.models import (
    Band,
    Instrument,
    BandPackage,
    BandRelatedInstrument,
    BandPackageRelatedBand,
    LessonPackage

)

APP_DIR = Path(__file__).resolve().parent.parent.parent
FIXTURES_DIR = APP_DIR.joinpath("fixtures")


class Command(BaseCommand):
    """
    this command is used to create the initial product catalogue
    """

    help = "creates initial wagtail product catalogue"

    def handle(self, raise_error=False, *args, **options):
        # Create the root SignUp page
        # Delete all existing SignUpPages
        print('Deleting all existing products...')
        Term.objects.all().delete()
        Band.objects.all().delete()
        BandPackage.objects.all().delete()
        Instrument.objects.all().delete()
        BandPackageRelatedBand.objects.all().delete()
        BandRelatedInstrument.objects.all().delete()
        LessonPackage.objects.all().delete()

        print('Adding instruments')

        bands = [{
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

        for band in bands:
            new_band = Band.objects.create(name=band['description'])
            sort_order = 0
            for name in band['instruments']:
                instrument, created = Instrument.objects.get_or_create(
                    name=name)

                if created:
                    print(f'Added new instrument: {name}')
                else:
                    print(f'Instrument {name} already exists')

                if not BandRelatedInstrument.objects.filter(page=new_band, instruments=instrument).exists():
                    # Create the relation between Band and Instrument
                    BandRelatedInstrument.objects.create(
                        page=new_band, instruments=instrument, sort_order=sort_order)
                    sort_order = sort_order + 1

        new_package = BandPackage.objects.create(
            name="All Bands", key="all", fullprice=116, under30price=58, siblingprice=29)
        sort_order = 0
        for band in Band.objects.all():
            print('Trying to add band')
            print(band)

            if not BandPackageRelatedBand.objects.filter(page=new_package, band=band).exists():
                # Create the relation between Band and Instrument
                print('Adding related band')
                BandPackageRelatedBand.objects.create(
                    page=new_package, band=band, sort_order=sort_order)
                sort_order = sort_order + 1

        new_package = BandPackage.objects.create(
            name="Small Bands", key="small", includes="one", fullprice=58, under30price=29, siblingprice=29)
        sort_order = 0

        for band in Band.objects.exclude(name__in=['Big Band', 'Main Band']):
            print('Trying to add band')
            print(band)

            if not BandPackageRelatedBand.objects.filter(page=new_package, band=band).exists():
                # Create the relation between Band and Instrument
                print('Adding related band')
                BandPackageRelatedBand.objects.create(
                    page=new_package, band=band, sort_order=sort_order)
                sort_order = sort_order + 1
        new_package = BandPackage.objects.create(
            name="No Bands (Lessons Only)", key="none", fullprice=0, under30price=0, siblingprice=0)
        sort_order = 0

        lessons = {"none": {
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
        }}
        for lesson in lessons:
            new_lesson = LessonPackage.objects.create(
                key=lesson,
                name=lessons[lesson]['description'],
                fullprice=lessons[lesson]['price'],
                under30price=lessons[lesson]['price']/2,
                siblingprice=lessons[lesson]['price']/4)
        self.stdout.write(self.style.SUCCESS(
            'Successfully created the root page and child pages, and set up the default site.'))
