from django.urls import path
from . import views

urlpatterns = [
    # path('', views.home, name='home'),
    path("analyze-receipt", views.ReciteSplitting.as_view(), name="analyze-receipt")

]
