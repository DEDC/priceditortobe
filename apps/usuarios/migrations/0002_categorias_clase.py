# Generated by Django 2.1.5 on 2019-03-04 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='categorias',
            name='clase',
            field=models.CharField(default='', max_length=30),
        ),
    ]