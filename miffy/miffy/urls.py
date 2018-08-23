"""miffy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include,path
from db import db_op
from . import views

urlpatterns = [

    path('add_group', db_op.add_group, name='add_group'),
    path('show_group', db_op.show_group, name='show_group'),
    path('del_group', db_op.del_group, name='del_group'),
    path('clear_group', db_op.clear_group, name='clear_group'),
    path('modify_grp', db_op.modify_grp, name='modify_grp'),
    
    path('add_person', db_op.add_person, name='add_person'),
    path('show_person', db_op.show_person, name='show_person'),
    path('show_person_detail', db_op.show_person_detail, name='show_person_detail'),
    path('show_owner_person', db_op.show_owner_person, name='show_owner_person'),
    path('del_person', db_op.del_person, name='del_person'),

    path('clear_person', db_op.clear_person, name='clear_person'),
    path('on_login', db_op.on_login, name='on_login'),
    path('register', db_op.register, name='register'),
    
    path('get_users', db_op.get_users, name='get_users'),
    path('modify_auth', db_op.modify_auth, name='modify_auth'),
    
    path('', views.home, name='home'),

    path('admin/', admin.site.urls),
]
