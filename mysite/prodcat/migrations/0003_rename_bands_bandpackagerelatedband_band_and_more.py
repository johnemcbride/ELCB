# Generated by Django 4.2.15 on 2024-09-14 13:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('prodcat', '0002_bandpackage_includes'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bandpackagerelatedband',
            old_name='bands',
            new_name='band',
        ),
        migrations.AlterUniqueTogether(
            name='bandpackagerelatedband',
            unique_together={('page', 'band')},
        ),
    ]
