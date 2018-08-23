#!/usr/bin/bash

firewall-cmd --add-port=443/tcp

mkdir /root/soft
cd /root/soft
yum -y groupinstall "Development tools"
yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel
wget https://www.python.org/ftp/python/3.6.6/Python-3.6.6.tgz
tar -xzf Python-3.6.6.tgz
cd Python-3.6.6
mkdir /usr/local/python3
./configure --prefix=/usr/local/python3
make && make install
ln -s /usr/local/python3/bin/python3 /usr/bin/python3
ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3

rm -f /usr/bin/python
ln -s /usr/bin/python3 /usr/bin/python

pip3 install --upgrade pip
pip3 install Django==2.0.7
pip3 install uwsgi

#wget https://files.pythonhosted.org/packages/a2/c9/a2d5737f63cd9df4317a4acc15d1ddf4952e28398601d8d7d706c16381e0/uwsgi-2.0.17.1.tar.gz

echo 'export PATH="$PATH:/usr/local/python3/bin"'  >> /etc/profile
source /etc/profile

cd /root/soft
wget http://nginx.org/download/nginx-1.13.12.tar.gz
tar -xzf nginx-1.13.12.tar.gz
cd nginx-1.13.12
./configure --prefix=/usr/local/nginx-1.13.12 --with-http_stub_status_module --with-http_gzip_static_module --with-http_ssl_module
make && make install

rm -f /root/miffy/nginx/nginx.conf 
ln -s /root/miffy/nginx/nginx.conf nginx.conf

#uwsgi --ini /etc/uwsgi9090.ini &
#/usr/local/nginx-1.13.12/sbin/nginx 

#1.创建服务器证书密钥文件 server.key：
# openssl genrsa -des3 -out miffy.key 2048
#2.创建服务器证书的申请文件 server.csr
#Enter pass phrase for root.key: ← 输入前面创建的密码 
#Country Name (2 letter code) [AU]:CN ← 国家代号，中国输入CN 
#State or Province Name (full name) [Some-State]:BeiJing ← 省的全名，拼音 
#Locality Name (eg, city) []:BeiJing ← 市的全名，拼音 
#Organization Name (eg, company) [Internet Widgits Pty Ltd]:MyCompany Corp. ← 公司英文名 
#Organizational Unit Name (eg, section) []: ← 可以不输入 
#Common Name (eg, YOUR name) []: ← 此时不输入 
#Email Address []:admin@mycompany.com ← 电子邮箱，可随意填
#Please enter the following ‘extra’ attributes 
#to be sent with your certificate request 
#A challenge password []: ← 可以不输入 
#An optional company name []: ← 可以不输入
# openssl req -new -key miffy.key -out miffy.csr
#3.备份一份服务器密钥文件
# cp miffy.key miffy.key.org
#4.去除文件口令
# openssl rsa -in miffy.key.org -out miffy.key
#6.生成证书文件server.crt
# openssl x509 -req -days 3650 -in miffy.csr -signkey miffy.key -out miffy.crt
