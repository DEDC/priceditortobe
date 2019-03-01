from django.urls import path
from .views import vPrincipalAdmin, vPrincipalCliente, vRegistroUsuario, vEditarUsuario, vEliminarUsuario 
from apps.productos.views import vRegistroCategoria, vEditarCategoria, vEliminarCategoria, vRegistroProducto, getProductos, showProductos
app_name = 'usuarios'

urlpatterns = [
    path('cliente/', vPrincipalCliente, name = 'principalCliente'),
    path('cliente/ajax/producto', getProductos),
    path('cliente/show-producto', showProductos, name = 'show-producto'),
    path('admin/', vPrincipalAdmin, name = 'principalAdmin'),
    path('admin/nvo-usuario', vRegistroUsuario, name = 'registroUsuario'),
    path('admin/edit-usuario/<int:id>', vEditarUsuario, name = 'editarUsuario'),
    path('admin/elim-usuario/<int:id>', vEliminarUsuario, name = 'eliminarUsuario'),
    path('admin/nvo-categoria', vRegistroCategoria, name = 'registroCategoria'),
    path('admin/edit-categoria/<int:id>', vEditarCategoria, name = 'editarCategoria'),
    path('admin/elim-categoria/<int:id>', vEliminarCategoria, name = 'eliminarCategoria'),
    path('admin/nvo-producto', vRegistroProducto, name = 'registroProducto'),
]