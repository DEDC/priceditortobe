from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http.response import HttpResponseNotFound
from django.contrib.auth.models import User
from .forms import fRegistroUsuario
from apps.productos.models import Categorias, Productos 

def vLogin(request):
    logout(request)
    if request.method == 'POST':
        user = request.POST.get('user')
        passw = request.POST.get('pass')
        auth = authenticate(username = user, password = passw)
        if auth is not None:
            login(request, auth)
            if request.user.is_superuser:
                return redirect('usuarios:principalAdmin')
            elif not request.user.is_superuser:
                return redirect('usuarios:principalCliente')
            else: 
                return redirect('login')
        else:
            return redirect('login')
    return render(request, 'login.html')

def vLogout(request):
    logout(request)
    return redirect('login')

@login_required(login_url = '/')
def vPrincipalAdmin(request):
    usuarios = User.objects.all()
    categorias = Categorias.objects.all()
    productos = Productos.objects.all()
    context = {'usuarios' : usuarios, 'categorias' : categorias, 'productos' : productos}
    return render(request, 'admin/principalAdmin.html', context)

def vRegistroUsuario(request):
    if request.method == 'POST':
        fRU = fRegistroUsuario(request.POST)
        if fRU.is_valid():
            usuario = fRU.save(commit = False)
            if not request.POST.__contains__('is_cliente'):
                usuario.is_superuser = True
            usuario.set_password(usuario.password)
            usuario.save()
            return redirect('usuarios:registroUsuario')
    else:
        fRU = fRegistroUsuario()
    context = {'fRU' : fRU}
    return render(request, 'admin/registroUsuario.html', context)

def vEditarUsuario(request, id):
    # decorador para validar si es admin
    if request.user.is_staff:
        usuario = get_object_or_404(User, pk = id)
        if request.method == 'POST':
            if request.POST.get('password'):
                form = fRegistroUsuario(request.POST, instance=usuario)    
                if form.is_valid():
                    f = form.save(commit=False)
                    f.set_password(f.password)
                    f.save()
            else:
                r_copy = request.POST.copy()
                r_copy.setdefault('password', '12345')
                form = fRegistroUsuario(r_copy, instance=usuario)    
                if form.is_valid():
                    f = form.save(commit=False)
                    f.save(update_fields = ['first_name', 'last_name', 'username', 'email'])
        else:
            form = fRegistroUsuario(instance = usuario)
    else:
        return redirect('login')
    context = {'form' : form, 'usuario' : usuario}
    return render(request, 'admin/editarUsuario.html', context)

def vEliminarUsuario(request, id):
    usuario = get_object_or_404(User, pk = id)
    if request.method == 'POST':
        usuario.delete()
    context = {'usuario' : usuario}
    return render(request, 'admin/eliminarUsuario.html', context)    

def vPrincipalCliente(request):
    return render(request, 'cliente/principalCliente.html')
