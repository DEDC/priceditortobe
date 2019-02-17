from django.db import models
from django.contrib.auth.models import User
from apps.productos.models import Productos

class Descargas(models.Model):
    fecha_hora = models.DateTimeField(auto_now = True)
    usuario = models.ForeignKey(User, blank = True, on_delete = models.PROTECT)
    usu_pro = models.ManyToManyField(Productos, related_name = 'pro_des', blank = True)
