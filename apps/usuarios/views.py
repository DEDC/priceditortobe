from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import get_object_or_404
from django.http.response import HttpResponseNotFound
from django.contrib import messages
from .forms import fRegistroUsuario
from .models import User
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
                messages.success(request, 'Bienvenido(a) '+request.user.get_full_name())
                return redirect('usuarios:principalAdmin')
            elif not request.user.is_superuser:
                messages.success(request, 'Bienvenido(a) '+request.user.get_full_name())
                return redirect('usuarios:principalCliente')
            else: 
                return redirect('login')
        else:
            messages.error(request, 'Usuario o contraseña no válidos')
            return redirect('login')
    return render(request, 'login.html')

def vLogout(request):
    logout(request)
    return redirect('login')

def is_staff_check(user):
    return user.is_staff

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vPrincipalAdmin(request):
    usuarios = User.objects.all()
    total_u = usuarios.count()
    categorias = Categorias.objects.all()
    total_c = categorias.count()
    productos = Productos.objects.all()
    total_p = productos.count()
    context = {'usuarios' : usuarios, 'categorias' : categorias, 'productos' : productos, 'total_u' : total_u, 'total_c' : total_c, 'total_p' : total_p}
    return render(request, 'admin/principalAdmin.html', context)

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vRegistroUsuario(request):
    if request.method == 'POST':
        fRU = fRegistroUsuario(request.POST)
        if fRU.is_valid():
            usuario = fRU.save(commit = False)
            if not request.POST.__contains__('is_cliente'):
                usuario.is_staff = True
            usuario.set_password(usuario.password)
            usuario.save()
            messages.success(request, 'Usuario agregado exitosamente')
            return redirect('usuarios:principalAdmin')
    else:
        fRU = fRegistroUsuario()
    context = {'fRU' : fRU}
    return render(request, 'admin/registroUsuario.html', context)

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vEditarUsuario(request, id):
    usuario = get_object_or_404(User, pk = id)
    if request.method == 'POST':
        if request.POST.get('password'):
            form = fRegistroUsuario(request.POST, instance=usuario)    
            if form.is_valid():
                f = form.save(commit=False)
                f.set_password(f.password)
                f.save()
                messages.success(request, 'Cambios guardados exitosamente')
                return redirect('usuarios:principalAdmin')
        else:
            r_copy = request.POST.copy()
            r_copy.setdefault('password', '12345')
            form = fRegistroUsuario(r_copy, instance=usuario)    
            if form.is_valid():
                f = form.save(commit=False)
                f.save(update_fields = ['first_name', 'last_name', 'username', 'email', 'categoria'])
                messages.success(request, 'Cambios guardados exitosamente')
                return redirect('usuarios:principalAdmin')
    else:
        form = fRegistroUsuario(instance = usuario)
    context = {'form' : form, 'usuario' : usuario}
    return render(request, 'admin/editarUsuario.html', context)

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vEliminarUsuario(request, id):
    usuario = get_object_or_404(User, pk = id)
    if request.method == 'POST':
        usuario.delete()
        messages.success(request, 'Usuario eliminado exitosamente')
        return redirect('usuarios:principalAdmin')
    context = {'usuario' : usuario}
    return render(request, 'admin/eliminarUsuario.html', context)    

@login_required(login_url = '/')
def vPrincipalCliente(request):
    categorias = Categorias.objects.all()
    return render(request, 'cliente/principalCliente.html', {'categorias' : categorias})
