Application IESA 
================

Description
-----------

Application d'aide à la vie quotidienne au sein de l'école à destionation des étudiants. 
L'application se comport comme un réseaux social avec la possibilité de récupérer le contacts de l'IESA, des cours et les dates de ceux-ci etc... 

Installation
------------


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
cordova plugin add org.apache.cordova.vibration
cordova plugin add org.apache.cordova.geolocation
cordova plugin add org.apache.cordova.globalization
cordova plugin add org.apache.cordova.device-orientation
cordova plugin add org.apache.cordova.network-information
cordova plugin add com.danielcwilson.plugins.googleanalytics
cordova -d plugin add https://github.com/phonegap/phonegap-facebook-plugin --variable APP_ID="871619222864601" --variable APP_NAME="Iesa"
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


URL JSON statique
================

- planning: www/planning.json
- contacts: www/contacts.json
- address: www/address.json
