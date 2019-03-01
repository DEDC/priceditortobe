from django import forms
from .models import User

class fRegistroUsuario(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'categoria']
        widgets = {
            'password' : forms.PasswordInput(),
            'categoria' : forms.Select(attrs={'id' : 'select'})
        }