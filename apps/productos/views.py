from django.shortcuts import render, redirect
from .forms import fRegistroCategoria

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

