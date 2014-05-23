JOUR 1
======


BLOCAGE 1
---------

Critique : non

Platform : Emulation Android sous Mac OS

Problème : Emulation lente avec ADT

Solution : Debug sur smartphone Android physique


JOUR 2
======

BLOCAGE 2
---------

Critique : oui

Platform : Application Android sous Mac OS 

Problème : Plugin contact et camera impossible a faire fonctionner sous Android 

Solution : Utilisation de cordova 3.5.0


JOUR 3
------

JOUR 4
------

JOUR 5
------
Critique : oui
 
Platform : Application IOS et Android

Problème : Plugin facebook, impossible d'utiliser l'objet FB et les différents
Solution : 
ajouter dans l'index.html les balises scripts :

```
<script type="text/javascript" src="cordova.js"></script>
<script type="text/javascript" src="cdv-plugin-fb-connect.js"></script>
```
et utiliser le FB.init avec les options suivantes :

```
appId: "871619222864601",
nativeInterface: CDV.FB,
useCachedDialogs: false
```
