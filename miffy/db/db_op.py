from django.shortcuts import render
from django.db.models import F, FloatField, Sum
from django.core.exceptions import ObjectDoesNotExist
import requests
import uuid
import datetime


# Create your views here.

from django.http import HttpResponse
from db import models
import json
from django.core import serializers

def dump_group(result, msg, uuidstr):
    
    pgid_id = -1
    if uuidstr != '':
        user_data = models.UserInfo.objects.filter(uuid=uuidstr).values()
        if len(list(user_data)) > 0:
            if list(user_data)[0]['pgid_id'] is not None:
                pgid_id = list(user_data)[0]['pgid_id']
    
    all_group = models.Group.objects.all().values('gid','gname') 
    #print(list(all_group))
    
    json_data = json.dumps(list(all_group))

    #resp = '{result:{},msg:{},data:{}}'.format(result, msg, json_data)
    resp =  "{\"result\":%d,\"msg\":\"%s\",\"data\":%s, \"owner_grp\": %d}" % (result, msg, json_data, pgid_id)
    
    return HttpResponse(resp)

def show_group(request):
    uuidstr = ''

    if request.method == 'POST':
        uuidstr = request.POST.get('uuid', '')
    elif request.method == 'GET':
        uuidstr = request.GET.get('uuid', '')
        
    return dump_group(0, "", uuidstr)
    
    
def add_group(request):
    name = ''
    uuidstr = ''
    
    if request.method == 'POST':
        req_obj = request.POST
    elif request.method == 'GET':
        req_obj = request.GET
    
    name = req_obj['name']
    uuidstr = req_obj['uuid']
    
    if name == '':
        return dump_group(-1, "please input group name", uuidstr)
        
    all_group = models.Group.objects.all().values('gid', 'gname')

    for item in all_group:
        if item['gname'] == name:
            return dump_group(-1, "already same name", uuidstr)
            

    models.Group.objects.create(gname=name)
    
    return dump_group(0, "", uuidstr)
    
def del_group(request):
    name = ''

    if request.method == 'POST':
        name = request.POST['name']
    elif request.method == 'GET':
        name = request.GET['name']
    
    if name == '':
        return dump_group(-1, "please input group name")
    
    models.Group.objects.filter(gid=name).delete()
    
    #objs = models.UserInfo.objects.filter(pgid=name)
    #obj.pgid_id = group_data
    #obj.save()
    
    return show_group(request)
    
    
def dump_person(result, msg, detail):
    all_group = models.Group.objects.all().values('gid','gname')

    #print(all_group)
    list_group = list(all_group)
    
    if detail:
        all_person = models.Person.objects.all().values('pgid'
                                                        ,'miwang'
                                                        ,'mifei'
                                                        ,'mifen'
                                                        ,'mixiaozhu'
                                                        ,'zhaoan'
                                                        ,'wangan'
                                                        ,'shiyonzhang'
                                                        ,'huifang'
                                                        ,'ditui'
                                                        ,'yingliu'
                                                        ,'fenxiang'
                                                        ,'zhibang'
                                                        ,'linshe'
                                                        ,'total')
    else:
        all_person = models.Person.objects.all().values('pgid').annotate(miwang=Sum('miwang')
                            , mifei=Sum('mifei')
                            , mifen=Sum('mifen')
                            , mixiaozhu=Sum('mixiaozhu')
                            , zhaoan=Sum('zhaoan')
                            , wangan=Sum('wangan')
                            , shiyonzhang=Sum('shiyonzhang')
                            , huifang=Sum('huifang')
                            , ditui=Sum('ditui')
                            , yingliu=Sum('yingliu')
                            , fenxiang=Sum('fenxiang')
                            , zhibang=Sum('zhibang')
                            , linshe=Sum('linshe')
                            , total=Sum('total')).order_by('-total')
                            
    list_person = list(all_person)
    
    dict_total = {}
    dict_total['no'] = '总计'
    dict_total['pgid'] = ''
    dict_total['miwang'] = 0
    dict_total['mifei'] = 0
    dict_total['mifen'] = 0
    dict_total['mixiaozhu'] = 0
    dict_total['zhaoan'] = 0
    dict_total['wangan'] = 0
    dict_total['shiyonzhang'] = 0
    dict_total['huifang'] = 0
    dict_total['ditui'] = 0
    dict_total['yingliu'] = 0
    dict_total['fenxiang'] = 0
    dict_total['zhibang'] = 0
    dict_total['linshe'] = 0
    dict_total['total'] = 0
    dict_total['index'] = 0
    
    no = 1
    for person in list_person:
        person['no'] = no
        person['index'] = no
        no = no + 1
        for group in all_group:
            if person['pgid'] == group['gid']:
                person['pgid'] = group['gname']
                
        dict_total['miwang'] += person['miwang']
        dict_total['mifei'] += person['mifei']
        dict_total['mifen'] += person['mifen']
        dict_total['mixiaozhu'] += person['mixiaozhu']
        dict_total['zhaoan'] += person['zhaoan']
        dict_total['wangan'] += person['wangan']
        dict_total['shiyonzhang'] += person['shiyonzhang']
        dict_total['huifang'] += person['huifang']
        dict_total['ditui'] += person['ditui']
        dict_total['yingliu'] += person['yingliu']
        dict_total['fenxiang'] += person['fenxiang']
        dict_total['zhibang'] += person['zhibang']
        dict_total['linshe'] += person['linshe']
        dict_total['total'] += person['total']
        
    dict_total['index'] = no

    list_person.append(dict_total)
    
    resp = "{\"result\":%d,\"msg\":\"%s\",\"data\":%s}" % (result, msg, json.dumps(list_person))
    
    return HttpResponse(resp)
    
def show_person(request):
    if request.method == 'POST':
        req_obj = request.POST
    elif request.method == 'GET':
        req_obj = request.GET
        
    #pgid = req_obj['pgid']
    user_uuid = req_obj['uuid']
    sdate = req_obj['sdate']
    edate = req_obj['edate']
        
    start_date = datetime.datetime.strptime(sdate, "%Y-%m-%d")
    end_date = datetime.datetime.strptime(edate, "%Y-%m-%d")
    
    all_group = models.Group.objects.all().values('gid','gname')
    #print(all_group)
    list_group = list(all_group)
    
    if user_uuid != '':
        user_data = models.UserInfo.objects.get(uuid=user_uuid)
        all_person = models.Person.objects.filter(uuid=user_data, p_create_date__range=(start_date, end_date)).values('pgid'
                                                        ,'miwang'
                                                        ,'mifei'
                                                        ,'mifen'
                                                        ,'mixiaozhu'
                                                        ,'zhaoan'
                                                        ,'wangan'
                                                        ,'shiyonzhang'
                                                        ,'huifang'
                                                        ,'ditui'
                                                        ,'yingliu'
                                                        ,'fenxiang'
                                                        ,'zhibang'
                                                        ,'linshe'
                                                        ,'total'
                                                        ,'id')

    else:
        
        all_person = models.Person.objects.filter(p_create_date__range=(start_date, end_date)).values('pgid').annotate(miwang=Sum('miwang')
                            , mifei=Sum('mifei')
                            , mifen=Sum('mifen')
                            , mixiaozhu=Sum('mixiaozhu')
                            , zhaoan=Sum('zhaoan')
                            , wangan=Sum('wangan')
                            , shiyonzhang=Sum('shiyonzhang')
                            , huifang=Sum('huifang')
                            , ditui=Sum('ditui')
                            , yingliu=Sum('yingliu')
                            , fenxiang=Sum('fenxiang')
                            , zhibang=Sum('zhibang')
                            , linshe=Sum('linshe')
                            , total=Sum('total')).order_by('-total')
                            
        sum_person = models.Person.objects.filter(p_create_date__range=(start_date, end_date)).values('pgid','uuid').annotate(miwang=Sum('miwang')
                            , mifei=Sum('mifei')
                            , mifen=Sum('mifen')
                            , mixiaozhu=Sum('mixiaozhu')
                            , zhaoan=Sum('zhaoan')
                            , wangan=Sum('wangan')
                            , shiyonzhang=Sum('shiyonzhang')
                            , huifang=Sum('huifang')
                            , ditui=Sum('ditui')
                            , yingliu=Sum('yingliu')
                            , fenxiang=Sum('fenxiang')
                            , zhibang=Sum('zhibang')
                            , linshe=Sum('linshe')
                            , total=Sum('total'))
                            
    list_person = list(all_person)
    list_sum_person = list(sum_person)
    
    for item in list_sum_person:
        item['nickname'] = models.UserInfo.objects.get(openid=item['uuid']).nickname
    
    dict_total = {}
    dict_total['no'] = '总计'
    dict_total['pgid'] = ''
    dict_total['miwang'] = 0
    dict_total['mifei'] = 0
    dict_total['mifen'] = 0
    dict_total['mixiaozhu'] = 0
    dict_total['zhaoan'] = 0
    dict_total['wangan'] = 0
    dict_total['shiyonzhang'] = 0
    dict_total['huifang'] = 0
    dict_total['ditui'] = 0
    dict_total['yingliu'] = 0
    dict_total['fenxiang'] = 0
    dict_total['zhibang'] = 0
    dict_total['linshe'] = 0
    dict_total['total'] = 0
    dict_total['index'] = 0
    dict_total['id'] = ''
    
    no = 1
    for person in list_person:
        if 'id' not in person.keys():
            dict_total['id'] = ''
            
        person['no'] = no
        person['index'] = no
        no = no + 1
        
        #person['pgid'] = models.Group.objects.get(gid=person['pgid']).gname
        person['gname'] = models.Group.objects.get(gid=person['pgid']).gname
        
                
        dict_total['miwang'] += person['miwang']
        dict_total['mifei'] += person['mifei']
        dict_total['mifen'] += person['mifen']
        dict_total['mixiaozhu'] += person['mixiaozhu']
        dict_total['zhaoan'] += person['zhaoan']
        dict_total['wangan'] += person['wangan']
        dict_total['shiyonzhang'] += person['shiyonzhang']
        dict_total['huifang'] += person['huifang']
        dict_total['ditui'] += person['ditui']
        dict_total['yingliu'] += person['yingliu']
        dict_total['fenxiang'] += person['fenxiang']
        dict_total['zhibang'] += person['zhibang']
        dict_total['linshe'] += person['linshe']
        dict_total['total'] += person['total']
        
    dict_total['index'] = no

    list_person.append(dict_total)
    
    resp = "{\"result\":%d,\"msg\":\"%s\",\"data\":%s,\"person_detail\":%s}" % (0, "", json.dumps(list_person), json.dumps(list_sum_person))
    
    print(resp)
    
    return HttpResponse(resp)
    
def show_owner_person(request):
    if request.method == 'POST':
        req_obj = request.POST
    elif request.method == 'GET':
        req_obj = request.GET
        
    #pgid = req_obj['pgid']
    user_uuid = req_obj['uuid']
    sdate = req_obj['sdate']
    edate = req_obj['edate']
        
    start_date = datetime.datetime.strptime(sdate, "%Y-%m-%d")
    end_date = datetime.datetime.strptime(edate, "%Y-%m-%d")
    
    all_group = models.Group.objects.all().values('gid','gname')
    #print(all_group)
    list_group = list(all_group)
    
    user_data = models.UserInfo.objects.get(uuid=user_uuid)
    all_person = models.Person.objects.filter(uuid=user_data, p_create_date__range=(start_date, end_date)).values('pgid'
                                                    ,'miwang'
                                                    ,'mifei'
                                                    ,'mifen'
                                                    ,'mixiaozhu'
                                                    ,'zhaoan'
                                                    ,'wangan'
                                                    ,'shiyonzhang'
                                                    ,'huifang'
                                                    ,'ditui'
                                                    ,'yingliu'
                                                    ,'fenxiang'
                                                    ,'zhibang'
                                                    ,'linshe'
                                                    ,'total'
                                                    ,'id')
                            
    list_person = list(all_person)
   
    dict_total = {}
    dict_total['no'] = '总计'
    dict_total['pgid'] = ''
    dict_total['miwang'] = 0
    dict_total['mifei'] = 0
    dict_total['mifen'] = 0
    dict_total['mixiaozhu'] = 0
    dict_total['zhaoan'] = 0
    dict_total['wangan'] = 0
    dict_total['shiyonzhang'] = 0
    dict_total['huifang'] = 0
    dict_total['ditui'] = 0
    dict_total['yingliu'] = 0
    dict_total['fenxiang'] = 0
    dict_total['zhibang'] = 0
    dict_total['linshe'] = 0
    dict_total['total'] = 0
    dict_total['index'] = 0
    dict_total['id'] = ''
    
    no = 1
    for person in list_person:
        if 'id' not in person.keys():
            dict_total['id'] = ''
            
        person['no'] = no
        person['index'] = no
        no = no + 1
        
        #person['pgid'] = models.Group.objects.get(gid=person['pgid']).gname
        person['gname'] = models.Group.objects.get(gid=person['pgid']).gname
        
                
        dict_total['miwang'] += person['miwang']
        dict_total['mifei'] += person['mifei']
        dict_total['mifen'] += person['mifen']
        dict_total['mixiaozhu'] += person['mixiaozhu']
        dict_total['zhaoan'] += person['zhaoan']
        dict_total['wangan'] += person['wangan']
        dict_total['shiyonzhang'] += person['shiyonzhang']
        dict_total['huifang'] += person['huifang']
        dict_total['ditui'] += person['ditui']
        dict_total['yingliu'] += person['yingliu']
        dict_total['fenxiang'] += person['fenxiang']
        dict_total['zhibang'] += person['zhibang']
        dict_total['linshe'] += person['linshe']
        dict_total['total'] += person['total']
        
    dict_total['index'] = no

    list_person.append(dict_total)
    
    resp = "{\"result\":%d,\"msg\":\"%s\",\"data\":%s}" % (0, "", json.dumps(list_person))
    
    print(resp)
    
    return HttpResponse(resp)

def show_person_detail(request):
    return dump_person(0, "", True)

    
def add_person(request):
    if request.method == 'POST':
        req_obj = request.POST
    elif request.method == 'GET':
        req_obj = request.GET
    
    total = 0
    pgid = req_obj['pgid']
    miwang = req_obj['miwang']
    total += int(miwang) * 500
    
    mifei = req_obj['mifei']
    total += int(mifei) * 200
    
    mifen = req_obj['mifen']
    total += int(mifen) * 50
    
    mixiaozhu = req_obj['mixiaozhu']
    total += int(mixiaozhu) * 100
    
    zhaoan = req_obj['zhaoan']
    total += int(zhaoan) * 5
    
    wangan = req_obj['wangan']
    total += int(wangan) * 5
    
    shiyonzhang = req_obj['shiyonzhang']
    total += int(shiyonzhang) * 5
    
    huifang = req_obj['huifang']
    total += int(huifang) * 5
    
    ditui = req_obj['ditui']
    total += int(ditui) * 10
    
    yingliu = req_obj['yingliu']
    total += int(yingliu) * 10
    
    fenxiang = req_obj['fenxiang']
    total += int(fenxiang) * 20
    
    zhibang = req_obj['zhibang']
    total += int(zhibang) * 20
    
    linshe = req_obj['linshe']
    total += int(linshe) * 30
    
    user_uuid = req_obj['uuid']
    
    group_data = models.Group.objects.get(gid=pgid)
    user_data = models.UserInfo.objects.get(uuid=user_uuid)
        
    models.Person.objects.create(pgid=group_data
                                , miwang=miwang
                                , mifei=mifei
                                , mifen=mifen
                                , mixiaozhu=mixiaozhu
                                , zhaoan=zhaoan
                                , wangan=wangan
                                , shiyonzhang=shiyonzhang
                                , huifang=huifang
                                , ditui=ditui
                                , yingliu=yingliu
                                , fenxiang=fenxiang
                                , zhibang=zhibang
                                , linshe=linshe
                                , total=total
                                , uuid=user_data)
                                
    return dump_person(0, "", False)
    
def del_person(request):
    idkey = ''
    resp = ''
    
    if request.method == 'POST':
        idkey = request.POST['idkey']
    elif request.method == 'GET':
        idkey = request.GET['idkey']
    
    if idkey == '':
        resp = "{\"result\":%d,\"msg\":\"%s\",\"data\":\"%s\"}" % (-1, "idkey is empty", "")
    else:
        models.Person.objects.filter(id=idkey).delete()
        resp = "{\"result\":%d,\"msg\":\"%s\",\"data\":\"%s\"}" % (0, "", "")

    return HttpResponse(resp)


def clear_person(request):
    models.Person.objects.all().delete()
    return dump_person(0, "", False)
    
def clear_group(request):
    models.Group.objects.all().delete()
    return dump_group(0, "")
    
    
def modify_grp(request):
    uuidstr = ''
    pgid = ''
    
    if request.method == 'POST':
        uuidstr = request.POST.get('uuid', '')
        pgid = request.POST.get('pgid', '')
    elif request.method == 'GET':
        uuidstr = request.GET.get('uuid', '')
        pgid = request.GET.get('pgid', '')
        
    
    group_data = models.Group.objects.get(gid=pgid)
    
    try:
        obj = models.UserInfo.objects.get(uuid=uuidstr)
    except ObjectDoesNotExist:
        resp = "{\"result\":%d,\"msg\":\"%s\",\"authority\":%d,\"openid\":\"%s\"}" % (1, "does not exist", authority, openid)
        return HttpResponse(resp)
    except ex:
        resp = "{\"result\":%d,\"msg\":\"%s\"}" % (-1, ex.message)
        return HttpResponse(resp)
        
    obj.pgid_id = group_data
    obj.save()
     
    return dump_group(0, "", uuidstr)
    
def on_login(request):
    if request.method == 'POST':
        req_obj = request.POST
    elif request.method == 'GET':
        req_obj = request.GET

    code = req_obj['code']
    url = 'https://api.weixin.qq.com/sns/jscode2session'
    
    datas = {
        'grant_type': 'authorization_code',
        'appid': 'wx5f4faf1a8714c56a',
        'secret': '5265aa88a2b19449470f35b39bd37bea',
        'js_code': code
    }
    
    result = 0
    msg = ''
    
    json_rsp = {}
    try:
        response = requests.get(url, params=datas)
        json_rsp = response.json()
    except ex:
        resp = "{\"result\":%d,\"msg\":\"%s\"}" % (-1, ex.message)
        return HttpResponse(resp)
    
    print(json_rsp)
    #{'session_key': 'QRKsI3gHmT+C3Y3cvKiEmQ==', 'openid': 'ont5V40zWgt_TTV_DnN2hytxfctg'}
    authority = 0
    
    openid = json_rsp['openid'];
    
    print("login, openid = " + openid)
    
    try:
        rspdata = models.UserInfo.objects.get(openid=openid)
    except ObjectDoesNotExist:
        if openid == 'ont5V40zWgt_TTV_DnN2hytxfctg' or openid == 'ont5V40QQ_RK92p0LP-fSG6SEneo':
            authority = 1
        
        resp = "{\"result\":%d,\"msg\":\"%s\",\"authority\":%d,\"openid\":\"%s\"}" % (1, "does not exist", authority, openid)
        return HttpResponse(resp)
    except Exception as ex:
        resp = "{\"result\":%d,\"msg\":\"%s\"}" % (-1, ex.message)
        return HttpResponse(resp)

    resp = "{\"result\":%d,\"msg\":\"%s\",\"openid\":\"%s\",\"authority\":%d,\"uuid\":\"%s\",\"nickname\":\"%s\"}" % (result, msg, openid, rspdata.authority, rspdata.uuid, rspdata.nickname)
    
    return HttpResponse(resp)
    
def register(request):
    if request.method == 'POST':
        req_obj = request.POST
    elif request.method == 'GET':
        req_obj = request.GET
        
    openid = req_obj['openid']
    pgid = req_obj['pgid']
    nickname = req_obj['nickname']
    authority = req_obj['authority']
    genuuid = uuid.uuid1()
    addr = ''
    
    try:
        group_data = models.Group.objects.get(gid=pgid)
    except ObjectDoesNotExist:
        group_data = None
    
    models.UserInfo.objects.create(openid=openid,pgid=group_data,nickname=nickname,addr=addr,authority=authority,uuid=genuuid)

    result = 0
    msg = ''
    
    try:
        user_data = models.UserInfo.objects.get(openid=openid)
    except ObjectDoesNotExist:
        resp = "{\"result\":%d,\"msg\":\"%s\"}" % (-1, "does not exist")
        return HttpResponse(resp)

    resp = "{\"result\":%d,\"msg\":\"%s\",\"authority\":%s,\"uuid\":\"%s\",\"nickname\":\"%s\"}" % (result, msg, authority, genuuid, nickname)
    
    return HttpResponse(resp)
    
def get_users(request):
    
    all_users = models.UserInfo.objects.all().values('uuid','nickname','authority')
    resp =  "{\"result\":%d,\"msg\":\"%s\",\"data\":%s}" % (0, "", json.dumps(list(all_users)))
    
    return HttpResponse(resp)
    
    
def modify_auth(request):
    uuidstr = ''
    authority = ''
    
    if request.method == 'POST':
        uuidstr = request.POST.get('uuid', '')
        authority = request.POST.get('authority', '')
    elif request.method == 'GET':
        uuidstr = request.GET.get('uuid', '')
        authority = request.GET.get('authority', '')
    
    try:
        obj = models.UserInfo.objects.get(uuid=uuidstr)
    except ObjectDoesNotExist:
        resp = "{\"result\":%d,\"msg\":\"%s\",\"authority\":%d,\"openid\":\"%s\"}" % (-1, "does not exist", 0, '')
        return HttpResponse(resp)
    except ex:
        resp = "{\"result\":%d,\"msg\":\"%s\"}" % (-1, ex.message)
        return HttpResponse(resp)
        
    obj.authority = authority
    obj.save()
     
    return get_users(request)
    
    
def modify_nickname(request):
    name = ''
    uuidstr = ''
    
    if request.method == 'POST':
        req_obj = request.POST
    elif request.method == 'GET':
        req_obj = request.GET
    
    nickname = req_obj['nickname']
    uuidstr = req_obj['uuid']
    
    if nickname == '':
        resp = "{\"result\":%d,\"msg\":\"%s\"}" % (-1, "please input nickname name")
        return HttpResponse(resp)
        
    try:
        obj = models.UserInfo.objects.get(uuid=uuidstr)
    except ObjectDoesNotExist:
        resp = "{\"result\":%d,\"msg\":\"%s\"}" % (1, "user does not exist")
        return HttpResponse(resp)
    except ex:
        resp = "{\"result\":%d,\"msg\":\"%s\"}" % (-1, ex.message)
        return HttpResponse(resp)
        
    obj.nickname = nickname
    obj.save()
    
    resp = "{\"result\":%d,\"msg\":\"%s\"}" % (0, "")
    return HttpResponse(resp)

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    