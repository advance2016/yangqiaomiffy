from django.urls import path

from . import db_op

urlpatterns = [
    path('add_group', db_op.add_group, name='add_group'),
    path('show_group', db_op.show_group, name='show_group'),
    path('del_group', db_op.del_group, name='del_group'),
    
    path('add_person', db_op.add_person, name='add_person'),
    path('show_person', db_op.show_person, name='show_person'),
    path('del_person', db_op.del_person, name='del_person'),
    
    #path('', db_op.index, name='index'),
    #path('', views.index, name='index'),
]