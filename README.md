# Travail de Bachelor - HEG 2018

> Loïc Schupbach

Ce répertoire GitHub sert d'espace d'enregistrement à mon travail de Bachelor.

Celui-ci s'installe dans le cadre de mon cursus scolaire à la [Haute École de Gestion de Genève](https://www.hesge.ch/heg/)

## Structuration du répertoire GitHub
Ce répertoire comprendra 3 dossiers principaux. Un pour le travail de mémoire, un pour les sources externes et un dernier pour l'application elle-même :

- Memoire
- Sources externes
- Application

Vous trouverez également à la racine de ce répertoire la convention de travail de mon Bachelor

## Erreurs
> Il est possible de trouver les erreurs suivantes lors de la création d'une api REST avec Laravel

### Syntax error or access violation: 1071 Specified key was too long; max key length is 767 bytes")
Pour régler cette erreur, rendez vous dans le fichier "Providers/AppServiceProvider.php" et ajoutez :

```
use Illuminate\Support\Facades\Schema;
public function boot()
{
  Schema::defaultStringLength(191);
}
```



