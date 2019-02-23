from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import fRegistroUsuario

def vLogin(request):
    logout(request)
    print(request)
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
    return render(request, 'admin/principalAdmin.html')

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

def vPrincipalCliente(request):
    return render(request, 'cliente/principalCliente.html')
