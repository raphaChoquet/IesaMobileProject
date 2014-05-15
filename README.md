IesaMobileProject
=================

Création d'une application mobile pour l'IESA.
Technologie imposée

Mettre en place une boucle de feedback


Installation
============


Cloner le repository github

Lancer les commandes :
```
cordova platform add ios
cordova platform add android
``` 

Ajout des plugins :

```
cordova plugin add org.apache.cordova.camera
cordova plugin add org.apache.cordova.contacts
cordova plugin add org.apache.cordova.geolocation
cordova plugin add org.apache.cordova.globalization
cordova plugin add com.danielcwilson.plugins.googleanalytics
```

Lancer la commande 
```
cordova preprare
```

BOUCLE de Feedback
==================

D'une idée

PRODUIRE On produit un prototype, un produit viable minimun

=> On interview 2, 3 personnes (Une interview par personae) :
	On lui demande combien il mettrait dedans

MESURER On met en place un systéme de mesure

=> on analyse les données

APPRENDRE 

- Soit on pivote a nouveau si l'appli plait
- Sinon on arret

Premiére journée
================

- Application IOS et Android
- Coquille vide 
- Api Contacts
- Api Camera
- Api Geolocalisation

- Plus :
	- Globalization
	- Unit tests