from django.db import models
from django.contrib.auth.models import AbstractUser

class Categorias(models.Model):
    nombre = models.CharField(max_length = 50)
    def __str__(self):
        return '%s' % (self.nombre)

class User(AbstractUser):
    categoria = models.ForeignKey(Categorias, on_delete = models.PROTECT, null = True, blank = True)

class Descargas(models.Model):
    fecha_hora = models.DateTimeField(auto_now = True)
    usuario = models.ForeignKey(User, blank = True, on_delete = models.PROTECT)
    usu_pro = models.ManyToManyField('productos.Productos', related_name = 'pro_des', blank = True)

