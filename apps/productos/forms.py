from django import forms
from .models import Categorias

class fRegistroCategoria(forms.ModelForm):
    class Meta:
        model = Categorias
        fields = '__all__'