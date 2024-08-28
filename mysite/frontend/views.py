from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from inertia import render

import json


def login_view(request):
    if request.method == 'GET':
        print('GET outta here!')
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/')  # or return some Inertia response
        else:
            return render(request, 'SignIn', {
                'error': 'Invalid username or password',
                'username': username
            })
    return render(request, 'Login', {})


def logout_view(request):
    logout(request)
    return redirect('/')  # or return some Inertia response
