from django.db import models

# Create your models here.


class Group(models.Model):
    gid = models.AutoField('gid', primary_key=True)
    gname = models.CharField(max_length=200,unique=True)
    g_create_date = models.DateTimeField('create time', auto_now_add=True)
    
    def __str__(self):
        return self.gname

class UserInfo(models.Model):
    openid = models.CharField(max_length=100, primary_key=True)
    pgid = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True)
    nickname = models.CharField(max_length=100)
    addr = models.CharField(max_length=200)
    authority = models.PositiveIntegerField(default=0)
    uuid = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nickname
        
class Person(models.Model):
    pgid = models.ForeignKey(Group, on_delete=models.CASCADE)
    miwang = models.IntegerField(default=0)
    mifei = models.IntegerField(default=0)
    mifen = models.IntegerField(default=0)
    mixiaozhu = models.IntegerField(default=0)
    zhaoan = models.IntegerField(default=0)
    wangan = models.IntegerField(default=0)
    shiyonzhang = models.IntegerField(default=0)
    huifang = models.IntegerField(default=0)
    ditui = models.IntegerField(default=0)
    yingliu = models.IntegerField(default=0)
    fenxiang = models.IntegerField(default=0)
    zhibang = models.IntegerField(default=0)
    linshe = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    p_create_date = models.DateTimeField('create time', auto_now_add=True)
    uuid = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.pgid)
        

