from django.shortcuts import render, redirect
from .forms import fRegistroCategoria, fRegistroProducto, fRegistroImagen

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

