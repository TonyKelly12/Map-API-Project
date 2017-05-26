import django
import os
import random
import re
import cgi
import urllib

import hmac
import time
import hashlib
import random
from functools import wraps
from string import letters
from google.appengine.ext import ndb


secret = 'UwDx^YBPG8@5&mQY'#####Change secret


#### Global Functions #####
def gen_id():
    u_id = str(random.uniform(0, 1))
    return u_id


# this function is for rendering
def render_str(template, **params):
    t = jinja_env.get_template(template)####Change Enviorment
    return t.render(params)


# this function adds the secret to hash & value
def make_secure_val(val):
    return '%s|%s' % (val, hmac.new(secret, val).hexdigest())


# this function check to see if the seceret + val == hash
def check_secure_val(secure_val):
    val = secure_val.split('|')[0]
    if secure_val == make_secure_val(val):
        return val


# this function creats a random salt
def sprinkle_salt(length=5):
    return ''.join(random.choice(letters) for x in xrange(length))


# this function hash's the password
def make_pw_hash(username, pw, salt=None):
    if not salt:
        salt = sprinkle_salt()
    h = hashlib.sha256(username + pw + salt).hexdigest()
    return '%s,%s' % (salt, h)


# I think this function checks that the pwrd matches the hash
def valid_pw(username, password, h):
    salt = h.split(',')[0]
    return h == make_pw_hash(username, password, salt)


# this function builds the user key
def user_key(group='default'):
    return ndb.Key('User', 'group')


# this function builds the post key
def post_key(group='default'):
    return ndb.Key('Post', group, parent=user_key)


# this function builds the comment key
def comment_key(group='default'):
    return ndb.Key('Comment', group, parent=post_key)


def login_required(f):
    @wraps(f)
    def wrap(self, *a, **kw):
        if self.user:
            # print User.session
            return f(self, *a, **kw)
        else:
            return self.redirect('/login')

    return wrap


def p_edit_auth(f):
    @wraps(f)
    def wrap(self, *a, **kw):
        if self.user.username == Post.username:
            return f(self, *a, **kw)

    return wrap


def c_edit_auth(f):
    @wraps(f)
    def wrap(self, *a, **kw):
        if self.user.username == Comment.username:
            return f(self, *a, **kw)

    return wrap







    ##### Main WEbApp Handler + Render funcions #####