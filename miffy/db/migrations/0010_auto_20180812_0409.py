# Generated by Django 2.0.7 on 2018-08-12 04:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0009_auto_20180812_0406'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='pgid',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='db.Group'),
        ),
    ]