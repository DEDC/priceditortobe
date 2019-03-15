from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import get_object_or_404
import os 
from .forms import fRegistroCategoria, fRegistroProducto, fRegistroImagen
from .models import Productos, Categorias, Imagenes
from apps.usuarios.views import is_staff_check

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vRegistroCategoria(request):
    if request.method == 'POST':
        fRC = fRegistroCategoria(request.POST)
        if fRC.is_valid():
            fRC.save()
            messages.success(request, 'Categoría agregada existosamente')
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
            messages.success(request, 'Cambios guardados exitosamente')
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
            messages.success(request, 'Producto agregado exitosamente')
            return redirect('usuarios:registroProducto')
    else:
        fRP = fRegistroProducto()
        fRI = fRegistroImagen()
    context = {'fRP' : fRP, 'fRI' : fRI}
    return render(request, 'admin/registroProducto.html', context)

@login_required(login_url = '/')
@user_passes_test(is_staff_check, login_url = '/')
def vEditarProducto(request, id):
    producto = get_object_or_404(Productos, pk = id)
    imagen = get_object_or_404(Imagenes, pk = producto.imagen.id)
    old_img = imagen.imagen.path
    if request.method == 'POST':
        form = fRegistroProducto(request.POST, instance = producto)
        formI = fRegistroImagen(request.POST, request.FILES, instance = imagen)
        if request.FILES:
            if formI.is_valid():
                eliminarImagen(old_img)
                formI.save()
        if form.is_valid():
            formI.save()
            messages.success(request, 'Cambios guardados exitosamente')
            return redirect('usuarios:principalAdmin')
    else:
        form = fRegistroProducto(instance = producto)
        formI = fRegistroImagen()
    context = {'form' : form, 'formI' : formI, 'producto' : producto}
    return render(request, 'admin/editarProducto.html', context)

def vEliminarProducto(request, id):
    imagen = get_object_or_404(Imagenes, pk = id)
    producto = get_object_or_404(Productos, imagen = id)
    if request.method == 'POST':
        eliminarImagen(imagen.imagen.path)
        imagen.delete()
        messages.success(request, 'Producto eliminado exitosamente')
        return redirect('usuarios:principalAdmin')
    context = {'producto' : producto}
    return render(request, 'admin/eliminarProducto.html', context)

def eliminarImagen(path):
    print(path)
    if os.path.isfile(path):
        os.remove(path)

def getProductos(request):
    if request.is_ajax():
        texto = request.POST.get('texto')
        categoria = request.POST.get('categoria')
        if not categoria:
            productos = serializers.serialize('json', Productos.objects.filter(nombre__istartswith = texto), fields = ('nombre'))
        else:
            if texto == '*':
                productos = serializers.serialize('json', Productos.objects.filter(categoria__exact = categoria), fields = ('nombre'))
            else:        
                productos = serializers.serialize('json', Productos.objects.filter(nombre__istartswith = texto, categoria__exact = categoria), fields = ('nombre'))
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