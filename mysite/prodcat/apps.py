from django.apps import AppConfig


class ProdcatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'prodcat'

    def ready(self):
        import prodcat.hooks  # Ensure the hooks are registered
