from django import forms
from .models import Categorias, Productos, Imagenes

class fRegistroCategoria(forms.ModelForm):
    class Meta:
        model = Categorias
        fields = '__all__'

class fRegistroProducto(forms.ModelForm):
    class Meta:
        model = Productos
        exclude = ['imagen']

class fRegistroImagen(forms.ModelForm):
    class Meta:
        model = Imagenes
        fields = '__all__'