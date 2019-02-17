from django.db import models

class Categorias(models.Model):
    nombre = models.CharField(max_length = 50)
    def __str__(self):
        return '%s' % (self.nombre)

class Imagenes(models.Model):
    imagen = models.ImageField(upload_to='img_pro/')
    descripcion = models.CharField(max_length = 100, blank = True, null = True)

class Productos(models.Model):
    nombre = models.CharField(max_length = 50)
    categoria = models.ForeignKey(Categorias, on_delete = models.PROTECT)
    imagen = models.ForeignKey(Imagenes, blank = True, on_delete = models.CASCADE)
