# Generated by Django 2.0.7 on 2018-08-12 03:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0007_auto_20180812_0348'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='pgid',
            field=models.ForeignKey(default=-1, on_delete=django.db.models.deletion.SET_DEFAULT, to='db.Group'),
        ),
    ]
