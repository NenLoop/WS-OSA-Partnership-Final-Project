from django.db import models
from partnerships.models import Department, Partnership

NOTIFICATION_STATUS = (
    ('p', 'Pending'),
    ('r', 'Read'),
)

class Notification(models.Model):
    sender_id = models.ForeignKey(Department, on_delete=models.RESTRICT, null=True)
    partnership_id = models.ForeignKey(Partnership, on_delete=models.CASCADE, null=True)
    message = models.TextField()

    status = models.CharField(
        max_length=1, 
        choices=NOTIFICATION_STATUS,
        blank=True,
        default='p',
        help_text='Notification Status'
        )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        if self.partnership_id:
            return str(self.partnership_id)
        return str(self.message)