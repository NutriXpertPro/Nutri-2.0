from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def dispatch_task(task_func, *args, **kwargs):
    """
    Dispara uma task do Celery de forma segura.
    Se estiver em DEBUG e o Redis não estiver disponível, executa sincronamente
    para evitar o timeout de conexão do broker.
    """
    try:
        # Se estiver em modo síncrono (EAGER), mas falhar a conexão com o broker,
        # o .delay() pode travar por 10s no Windows.
        # Verificamos se há Redis configurado. 
        # No nosso settings, se REDIS_URL está vazio, CELERY_BROKER_URL é 'memory://'
        
        is_memory_broker = getattr(settings, 'CELERY_BROKER_URL', '').startswith('memory://')
        
        if settings.DEBUG and is_memory_broker:
            # Executa diretamente (sincronamente) sem passar pelo broker do Celery
            if hasattr(task_func, '__wrapped__'):
                return task_func.__wrapped__(*args, **kwargs)
            return task_func(*args, **kwargs)
            
        return task_func.delay(*args, **kwargs)
    except Exception as e:
        logger.warning(f"Falha ao disparar task {task_func.__name__} via Celery: {e}. Tentando execução síncrona.")
        if hasattr(task_func, '__wrapped__'):
            return task_func.__wrapped__(*args, **kwargs)
        return task_func(*args, **kwargs)
