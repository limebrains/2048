from django.contrib import admin

from game.models import Game, HighScores, HighScore


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    pass


class HighScoreInline(admin.TabularInline):
    model = HighScore


@admin.register(HighScores)
class HighScoresAdmin(admin.ModelAdmin):
    inlines = (
        HighScoreInline,
    )
