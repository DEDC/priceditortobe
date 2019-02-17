from django.db import models

class Categorias(models.Model):
    nombre = models.CharField(max_length = 50)

class Imagenes(models.Model):
    imagen = models.ImageField(upload_to='img_pro/')
    descripcion = models.CharField(max_length = 100)

class Productos(models.Model):
    nombre = models.CharField(max_length = 50)
    categoria = models.ForeignKey(Categorias, blank = True, on_delete = models.PROTECT)
    imagen = models.ForeignKey(Imagenes, blank = True, on_delete = models.CASCADE)
