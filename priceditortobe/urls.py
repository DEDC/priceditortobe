from django.urls import path, include
from apps.usuarios.views import vLogin, vLogout 
urlpatterns = [
    path('', vLogin, name = 'login'),
    path('logout', vLogin, name = 'logout'),
    path('user/', include('apps.usuarios.urls', namespace = 'usuario')),
]
