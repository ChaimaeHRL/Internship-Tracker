from django.contrib import admin
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'role', 'status', 'source', 'application_date', 'user')
    list_filter = ('status', 'source', 'application_date')
    search_fields = ('company_name', 'role', 'user__username')