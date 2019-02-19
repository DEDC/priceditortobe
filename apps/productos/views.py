from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from .forms import fRegistroCategoria, fRegistroProducto, fRegistroImagen
from .models import Productos

def vRegistroCategoria(request):
    if request.method == 'POST':
        fRC = fRegistroCategoria(request.POST)
        if fRC.is_valid():
            fRC.save()
            return redirect('usuarios:registroCategoria')
    else:
        fRC = fRegistroCategoria()
    context = {'fRC': fRC}
    return render(request, 'admin/registroCategoria.html', context)

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