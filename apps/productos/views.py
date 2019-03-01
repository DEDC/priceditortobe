from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import get_object_or_404
from .forms import fRegistroCategoria, fRegistroProducto, fRegistroImagen
from .models import Productos, Categorias
from apps.usuarios.views import is_staff_check

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vRegistroCategoria(request):
    if request.method == 'POST':
        fRC = fRegistroCategoria(request.POST)
        if fRC.is_valid():
            fRC.save()
            return redirect('usuarios:principalAdmin')
    else:
        fRC = fRegistroCategoria()
    context = {'fRC': fRC}
    return render(request, 'admin/registroCategoria.html', context)

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vEditarCategoria(request, id):
    categoria = get_object_or_404(Categorias, pk = id)
    if request.method == 'POST':
        form = fRegistroCategoria(request.POST, instance = categoria)
        if form.is_valid():
            form.save()
            return redirect('usuarios:principalAdmin')
    else:
        form = fRegistroCategoria(instance = categoria)
    context = {'categoria' : categoria, 'form' : form}
    return render(request, 'admin/editarCategoria.html', context)

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vEliminarCategoria(request, id):
    categoria = get_object_or_404(Categorias, pk = id)
    if request.method == 'POST':
        categoria.delete()
    context = {'categoria' : categoria}
    return render(request, 'admin/eliminarCategoria.html', context)
    
@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vRegistroProducto(request):
    if request.method == 'POST':
        fRP = fRegistroProducto(request.POST)
        fRI = fRegistroImagen(request.POST, request.FILES)
        if fRP.is_valid() and fRI.is_valid():
            producto = fRP.save(commit = False)
            producto.imagen = fRI.save()
            producto.save()
            return redirect('usuarios:registroProducto')
    else:
        fRP = fRegistroProducto()
        fRI = fRegistroImagen()
    context = {'fRP' : fRP, 'fRI' : fRI}
    return render(request, 'admin/registroProducto.html', context)

def getProductos(request):
    if request.is_ajax():
        texto = request.POST.get('texto')
        productos = serializers.serialize('json', Productos.objects.filter(nombre__istartswith = texto), fields = ('nombre'))
        return HttpResponse(productos, content_type = 'application/json')
    else:
        return redirect('login')

def showProductos(request):
    productos = []
    if request.method == 'POST':
        if request.POST.__contains__('chkb'):
            for p in request.POST.getlist('chkb'):
                if Productos.objects.filter(id__exact = p).exists():
                    producto = Productos.objects.get(id__exact = p)
                    productos.append(producto)
    context = {'productos' : productos}
    return render(request, 'cliente/mostrarProductos.html', context)