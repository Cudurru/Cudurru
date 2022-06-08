# Prelude

The intro music to any project. Written in Python.

### Installing

install requirements

> Setup venv inside .venv, so that bin, include, and libs don't clutter the root

```
sudo apt install python3-venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

```

Follow the other steps below


### Create Local Settings

```
cp prelude/local_settings.py.example prelude/local_settings.py

```
make sure to add the following to this file
JWT_PRIVATE_KEY 
    https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9 
    then base64 encode

BCRYPT_LEVEL
    this is an integer

CONFIG_FILE_NAME
    this contains the specifics to your instance, almost always stored in config.yml or config.yaml

UPLOAD_DIR
    this contains the path to the folder where uploads will be stored. By default it should be prelude/tmp . 

### Update the secrets file appropriate
```
```

### If Needed, install postgres
```
```

### If Needed, start postgres
```
postgres -D /usr/local/var/postgres
```
### or add auto start
```
```

### If Needed, install POSTGIS extension
```
sudo apt-get update
sudo apt-get install postgis
```

### Build database 
### overture is a placeholder name, if you change it you need to update alembic.ini

```
createdb overture

psql overture

create user portal with password 'test101';
grant all on database overture to portal;
CREATE EXTENSION postgis;

```


### Auto Generating Migrations Work Around
### to be run after making chances to the models file.

1- run the following command from cudurru/cudurru-services folder:
```
alembic revision --autogenerate -m "<migration message>"
```

2- This will create a new migration script on cudurru/cudurru-services/prelude/alembic/versions
  and also tell you the name of the migration script

3- Make sure to check if the migration script is doing what it is supposed to do.

4- If it isn't doing what it is supposed to do you may have to do some changes by hand,
  or deleting the script, rechecking your model (prelude/models.py) and trying to rerun 
  alembic revision --autogenerate. This migration script is executed every time you do
  vagrant up/provision, so steps 5-6 are really important.

5- The autogenerate function has some limitations, read the following article to learn more about them:
https://alembic.sqlalchemy.org/en/latest/autogenerate.html

6- The most common limitation is with name changes, alembic revision --autogenerate will interpret
  them as droping a table/column, and recreating/readding it. You will have to manually tell him 
  to rename them, by edditing the upgrade function, on the version file created.


### Run Migrations

```
alembic upgrade head
```

### Run mail server

```
python -m smtpd -n -c DebuggingServer localhost:1025
```

or you can just run
```
./run_debug_mail_server.sh
```



### Nginx Example

```
server {
    listen 80;
    server_name prelude.com;
    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```


### Run Server

```
source .venv/bin/activate
python -m prelude.base
```
### If you encounter abort trap 6 on a mac running catalina or later, you may need this info
```
https://dbaontap.com/2019/11/11/python-abort-trap-6-fix-after-catalina-update/
```

### Vim Setup

Install ale
using pylint for linting
autopep8 for fixer

Add this to the bottom of your .vimrc

```
" Allow project specific files
set exrc
set secure
```

This will load the project specific .vimrc file

### Testing with Pytest


```
python -m pytest --disable-pytest-warnings tests/test_base.py
```


### Testing with Curl

```
curl 127.0.0.1:8080/api/db -X POST -d '{"memberId": "123"}' -H 'Content-Type: application/json'
```


Generate private and key for JWT (In root directory)

```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```



