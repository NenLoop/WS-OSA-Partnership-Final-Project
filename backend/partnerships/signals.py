from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
from partnerships.models import Partnership
from notifications.models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

def make_message(instance, action):
    return f"Partnership '{instance.business_name}' was {action} by department '{instance.department_id.name}'."

@receiver(post_save, sender=Partnership)
def create_or_update_partnership_notification(sender, instance, created, **kwargs):
    # Sender user could come from extra context, adjust accordingly
    action = 'created' if created else 'updated'
    Notification.objects.create(
        sender_id=instance.department_id,
        partnership_id=instance,
        message=make_message(instance, action),
    )

@receiver(post_delete, sender=Partnership)
def delete_partnership_notification(sender, instance, **kwargs):
    Notification.objects.create(
        sender_id=instance.department_id,
        # The partnership instance is already deleted, so we cannot link to it.
        # The message itself contains the necessary information.
        message=make_message(instance, 'deleted'),
    )