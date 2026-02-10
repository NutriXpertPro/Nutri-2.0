from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import LabExam
from .serializers import LabExamSerializer

class LabExamViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar exames laboratoriais.
    """
    serializer_class = LabExamSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        # Filter lab exams for patients belonging to the logged-in nutritionist
        return LabExam.objects.filter(patient__nutritionist=self.request.user).select_related('patient__user')

    def perform_create(self, serializer):
        # Validate that the patient belongs to the nutritionist
        patient = serializer.validated_data['patient']
        if patient.nutritionist != self.request.user:
            from rest_framework import serializers
            raise serializers.ValidationError("Você só pode adicionar exames para seus pacientes.")
        
        lab_exam = serializer.save()

        # Criar notificação para o paciente
        try:
            from notifications.models import Notification
            from django.utils import timezone
            
            Notification.objects.create(
                user=patient.user,
                title="Novo Exame Disponível! 🔬",
                message=f"Seu nutricionista {self.request.user.name} enviou um novo resultado de exame: {lab_exam.name}. Confira em seu painel!",
                notification_type="system", # Ou um tipo específico se houver
                sent_at=timezone.now()
            )
        except Exception as e:
            print(f"Erro ao criar notificação de exame: {e}")

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Action para download do arquivo do exame.
        """
        lab_exam = self.get_object()
        if lab_exam.attachment:
            response = Response(
                lab_exam.attachment.read(),
                content_type='application/octet-stream'
            )
            response['Content-Disposition'] = f'attachment; filename="{lab_exam.attachment.name}"'
            return response
        return Response(
            {"error": "Nenhum arquivo anexado a este exame."},
            status=status.HTTP_404_NOT_FOUND
        )