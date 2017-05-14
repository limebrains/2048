from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_extensions.db.models import TimeStampedModel


class Game(TimeStampedModel):
    slug = models.SlugField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    cols = models.IntegerField(verbose_name=_('Amount of cols used for the game'))
    rows = models.IntegerField(verbose_name=_('Amount of rows used for the game'))


class HighScores(TimeStampedModel):
    game = models.ForeignKey('Game', verbose_name=_('Game'))


class HighScore(TimeStampedModel):
    high_scores = models.ForeignKey('HighScores', verbose_name=_('High score table'))
    score = models.IntegerField(verbose_name=_('Score'), default=0)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
