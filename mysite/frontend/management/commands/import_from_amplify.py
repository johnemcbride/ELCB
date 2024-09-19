import json
import boto3
from datetime import datetime
from pathlib import Path
from django.conf import settings
from django.contrib.contenttypes.models import ContentType

from boto3.dynamodb.types import TypeDeserializer
from django.core.management.base import BaseCommand  # Updated path for BaseCommand
from wagtail.models import Page, Site
from wagtail.contrib.redirects.models import Redirect
from wagtail.images.models import Image
from django.contrib.auth.models import User

from frontend.models import (
    Term

)

from frontend.models import (
    Member,
    Enrolment

)

APP_DIR = Path(__file__).resolve().parent.parent.parent
FIXTURES_DIR = APP_DIR.joinpath("fixtures")
# Replace with actual role ARN
role_arn = "arn:aws:iam::228447865234:role/x-account-admin"
role_session_name = "dynamo-access-session"
region = "eu-west-2"  # Replace with your desired AWS region
members_table = 'arn:aws:dynamodb:eu-west-2:228447865234:table/Member-r6l2mc5nzbdpfans746zcczq5e-prod'

deserializer = TypeDeserializer()


def scan_dynamodb_table(dynamodb_client, table_name):
    # Initialize the scan parameters
    scan_kwargs = {}
    has_more_rows = True
    all_items = []

    # Loop through paginated results
    while has_more_rows:
        # Scan the table
        response = dynamodb_client.scan(TableName=table_name, **scan_kwargs)

        # Get the items from the response
        items = response.get('Items', [])
        all_items.extend(items)

        # Check if there is more data to retrieve (pagination)
        last_evaluated_key = response.get('LastEvaluatedKey', None)
        if last_evaluated_key:
            # Continue scanning starting from the last key
            scan_kwargs['ExclusiveStartKey'] = last_evaluated_key
        else:
            has_more_rows = False

    return all_items


def demarshall_dynamodb_items(items):
    # Demarshall the DynamoDB format into regular JSON-like Python dicts
    return [{k: deserializer.deserialize(v) for k, v in item.items()} for item in items]


class Command(BaseCommand):
    """
    this command is used to import the data from amplify
    """

    help = "creates initial wagtail product catalogue"

    def handle(self, raise_error=False, *args, **options):
        # Create the root SignUp page
        # Delete all existing SignUpPages

        self.stdout.write(self.style.NOTICE(
            'Attempting to connect to DDB in Amplify Land'))

        sts_client = boto3.client('sts')
        # Assume the role
        response = sts_client.assume_role(
            RoleArn=role_arn,
            RoleSessionName=role_session_name
        )

        credentials = response['Credentials']

        self.stdout.write(self.style.SUCCESS(
            'Successfully assumed x-account privileges and can see the database'))

        self.stdout.write(self.style.SUCCESS(
            credentials))

        dynamodb_client = boto3.client(
            'dynamodb',
            region_name=region,
            aws_access_key_id=credentials['AccessKeyId'],
            aws_secret_access_key=credentials['SecretAccessKey'],
            aws_session_token=credentials['SessionToken']
        )

        # List all DynamoDB tables
        response = dynamodb_client.list_tables()

        # Print out the table names
        tables = response.get('TableNames', [])
        if tables:

            self.stdout.write(self.style.NOTICE(
                'DynamoDB Tables in the account:'))

            for table in tables:
                print(f"- {table}")
        else:
            self.stdout.write(self.style.ERROR(
                'No DDB here'))

        self.stdout.write(self.style.NOTICE(
            'Deleting all existing members and enrolments'))

        Enrolment.objects.all().delete()
        Member.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        for row in demarshall_dynamodb_items(scan_dynamodb_table(dynamodb_client, members_table)):
            try:
                # Create the user and catch potential errors
                user = User.objects.create_user(
                    username=row['username'], email=row['email'], password='password', first_name=row['forename'], last_name=row['surname'])
                member = Member.objects.get(user=user)
                member.ethnicity = row['ethnicity']
                self.stdout.write(self.style.SUCCESS(
                    row))

            # Catch IntegrityError (for example, if a unique constraint like email or username fails)
            except Exception as E:
                self.stdout.write(self.style.ERROR(
                    'Failed to add user '))
                self.stdout.write(self.style.ERROR(
                    row))
                self.stdout.write(self.style.ERROR(
                    E))

        print('Adding enr')
