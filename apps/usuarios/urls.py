from django.urls import path
from .views import vPrincipalAdmin, vPrincipalCliente, vRegistroUsuario, vEditarUsuario, vEliminarUsuario
from apps.productos.views import vRegistroCategoria, vRegistroProducto, getProductos, showProductos
app_name = 'usuarios'

urlpatterns = [
    path('cliente/', vPrincipalCliente, name = 'principalCliente'),
    path('cliente/ajax/producto', getProductos),
    path('cliente/show-producto', showProductos, name = 'show-producto'),
    path('admin/', vPrincipalAdmin, name = 'principalAdmin'),
    path('admin/nvo-usuario', vRegistroUsuario, name = 'registroUsuario'),
    path('admin/nvo-categoria', vRegistroCategoria, name = 'registroCategoria'),
    path('admin/nvo-producto', vRegistroProducto, name = 'registroProducto'),
    path('admin/edit-usuario/<int:id>', vEditarUsuario, name = 'editarUsuario'),
    path('admin/elim-usuario/<int:id>', vEliminarUsuario, name = 'eliminarUsuario'),
]