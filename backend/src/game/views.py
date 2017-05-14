from rest_framework import viewsets

from game.models import Game
from game.serializers import GameSerializer


class GameViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing Game and editing
    """
    serializer_class = GameSerializer
    queryset = Game.objects.all()
