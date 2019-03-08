from django.db import models
from apps.usuarios.models import Categorias

class Imagenes(models.Model):
    imagen = models.ImageField(upload_to='img_pro/')
    descripcion = models.CharField(max_length = 100, blank = True, null = True)

class Productos(models.Model):
    nombre = models.CharField(max_length = 50)
    color = models.CharField(max_length = 50, default = '#FFFFFF')
    categoria = models.ForeignKey(Categorias, on_delete = models.PROTECT)
    imagen = models.ForeignKey(Imagenes, blank = True, on_delete = models.CASCADE)
