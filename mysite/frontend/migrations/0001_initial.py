# Generated by Django 4.2.15 on 2024-08-17 05:23

from django.db import migrations, models
import django.db.models.deletion
import wagtail.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('wagtailcore', '0094_alter_page_locale'),
        ('wagtailimages', '0026_delete_uploadedimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='SignUpPage',
            fields=[
                ('page_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='wagtailcore.page')),
                ('welcome_message', wagtail.fields.RichTextField(blank=True, help_text='Enter a welcome message to greet visitors.')),
                ('logo', models.ForeignKey(blank=True, help_text='Upload a logo image that will be displayed on the page.', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='wagtailimages.image')),
            ],
            options={
                'verbose_name': 'Welcome Page',
            },
            bases=('wagtailcore.page',),
        ),
    ]
