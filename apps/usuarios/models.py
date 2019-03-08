from django.db import models
from django.contrib.auth.models import AbstractUser

class Categorias(models.Model):
    nombre = models.CharField(max_length = 50)
    clase = models.CharField(max_length = 30, default = '')
    def __str__(self):
        return '%s' % (self.nombre)

class User(AbstractUser):
    categoria = models.ForeignKey(Categorias, on_delete = models.PROTECT, null = True, blank = True)
    

