"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import UserDetailView, AdminUserList, AdminUserDetail, RegisterView, UserListView

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Login
    path('api/login/', TokenObtainPairView.as_view(), name="login"),
    path('api/refresh/', TokenRefreshView.as_view(), name="refresh"),

    # User API
    path('api/me/', UserDetailView.as_view()),

    # Admin API
    path('api/admin/users/', AdminUserList.as_view()),
    path('api/admin/users/<int:pk>/', AdminUserDetail.as_view()),

    path('api/register/', RegisterView.as_view(), name='register'),

    path('api/users/', UserListView.as_view()),

]
