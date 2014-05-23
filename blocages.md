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
======

JOUR 4
======

JOUR 5
======

BLOCAGE 1
---------

Critique : non
 
Platform : Application IOS et Android

Problème : Plugin facebook, impossible d'utiliser l'objet FB.
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

BLOCAGE 2
---------

Critique : oui
 
Platform : Application IOS et Android

Problème : Plugin facebook, impossible de partager une photo sur Facebook
Solution : 

Pour uploader une photo sur facebook, il faut convertir une image en base64 en un fichier au format Blob 
ensuite on doit créer un objet formData avec les clés :
 - access_token qui est égale au token récupéré lors du Facebook login
 - source qui est égale à l'image au format Blob
 - message qui est égale à la légende

Puis il ne reste plus qu'à faire une requête ajax sans utiliser FB.api

