from django_inertia import render


def index(request):
    return render(request, 'App', props={})
