# Generated by Django 2.0.7 on 2018-07-29 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0002_auto_20180729_1056'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='total',
            field=models.IntegerField(default=0),
        ),
    ]
