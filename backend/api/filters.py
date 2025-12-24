import django_filters
from .models import Partnership

class PartnershipFilter(django_filters.FilterSet):
    department_name = django_filters.CharFilter(field_name="department__name", lookup_expr='iexact')
    search = django_filters.CharFilter(field_name='business_name', lookup_expr='icontains')
    status = django_filters.ChoiceFilter(choices=Partnership.STATUS_CHOICES)
    partnership_type = django_filters.ChoiceFilter(choices=Partnership.PARTNERSHIP_TYPE_CHOICES)
    start_date = django_filters.DateFilter(field_name='started_date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='started_date', lookup_expr='lte')

    class Meta:
        model = Partnership
        fields = ['department_name', 'search', 'status', 'partnership_type', 'start_date', 'end_date']
