/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var map;
var myMarker;
var baseUrlJson = 'http://37.187.2.11/appli/'
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },



    // GLObalization

    i18nInit: function(lang) {
        jQuery.i18n.properties({
            name: 'Messages', 
            path: 'lang/', 
            mode: 'map',
            language: lang, 
            callback: function() {
                // We specified mode: 'both' so translated values will be
                // available as JS vars/functions and as a map

                // Accessing a simple value through the map
                $.i18n.prop('msg_hello');

                // Accessing a simple value through a JS variable
                alert($.i18n.prop('msg_hello'));
            }
        });       

    },


    
    onSuccess: function(position) {
        var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if (myMarker) {
            myMarker.setPosition(myLatlng);

        } else {
            myMarker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: "Ma position"
            });
        }
        $('#geoloc').html('LAT: ' + position.coords.latitude + ' / LONG: ' + position.coords.longitude);
    },

    onError: function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },

    initmarkers: function(map) {
        var icon = {
            origin : new google.maps.Point(0,0),
            size : new google.maps.Size(24,24),
            url : 'img/logo-iesa.png',
            anchor : new google.maps.Point(20,20)
        };
        $.getJSON(baseUrlJson + "address.json", function (address) {
            var markers = [];
            var infos = [];
            for (var i = 0; i < address.length; i++) {
                var myLatlng = new google.maps.LatLng(address[i].lat, address[i].long);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: address[i].name,
                    icon: icon
                });

                markers.push(marker);

                var infoWindow = new google.maps.InfoWindow({
                    content : '<div class="marker">' +
                        '<p class="marker-name">' + address[i].name + '</p>' +
                        '<p class="marker-address">' + address[i].address + '</p>' +
                        '<p class="marker-phone">' + address[i].phone + '</p>' +
                    '</div>',
                    maxWidth : 150,
                    pixelOffset : 0,
                    position : myLatlng
                });

                infos.push(infoWindow);

                google.maps.event.addListener(markers[i], 'click', (function (j) {
                    return function () {
                        infos[j].open(map, markers[j]);
                    };
                })(i));
            }
        });
    },


    initializeMap: function () {
        $('#map-canvas').height($(window).height()-$('#header').height()-$('#map-canvas').parent().outerHeight()-90);
        var mapOptions = {
          center: new google.maps.LatLng(48.8689041, 2.337638),
          zoom: 16
        };
        map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

        app.initmarkers(map);

        var watchID = navigator.geolocation.watchPosition(app.onSuccess, app.onError);
        
    },


    loadContact: function() {
        
        var contactEmailElement = document.getElementById('contactEmails');
        contactEmailElement.innerHTML = 'Loading...';

        var contactName = document.getElementById('contactName').value;

        var options = new ContactFindOptions();
        options.filter = contactName;
        options.multiple = true;
        var fields = ["displayName", "nickname", "name", "phoneNumbers", "emails"];
        navigator.contacts.find(fields, this.onContactFindSuccess, this.onContactFindError, options);
    },

    saveContact: function(evt) {
        evt.preventDefault();
        $('#contactEmails').children().each(function(){
            
              var name = $(this).find('.nom').html();
              var surname = $(this).find('.prenom').html();
              var phone = $(this).find('.phone').html();
              var email = $(this).find('.email').html();
              
              var options = new ContactFindOptions();
              options.filter = name;
              options.multiple = true;
              var fields = ["displayName", "nickname", "name", "phoneNumbers", "emails"];
              var test = navigator.contacts.find(fields, onContactFindSuccess, app.onContactFindError, options);
              
              function onContactFindSuccess(contact) {
                
                  if($.isEmptyObject(contact)) {
                      var contact = navigator.contacts.create();
                      contact.displayName = surname;
                      contact.nickname= surname;
                  
                      var contactName = new ContactName();
                      contactName.givenName = surname;
                      contactName.familyName = name;
                      contact.name = contactName;
                  
                      var phoneNumbers = [];
                      phoneNumbers[0] = new ContactField('work', phone, false);
                      contact.phoneNumbers = phoneNumbers;
                  
                      var emails = [];
                      emails[0] = new ContactField('work', email, true);
                      contact.emails = emails;
                  
                      contact.save(app.onContactSaved, app.onContactSavedError);
                  }
              }

        });
    },
    onContactSavedError : function(error) {
        alert("Impossible de sauvegarder les contacts <br> Errreur " + error.code);
    },
    onContactSaved : function() {
        var msg = 'Les contats ont bien été ajouté';
        alert(msg);
    },

    onContactFindSuccess: function(contact) {
        if($.isEmptyObject(contact)) {
            var contact = navigator.contacts.create();
            contact.displayName = surname;
            contact.nickname= surname;

            var contactName = new ContactName();
            contactName.givenName = surname;
            contactName.familyName = name;
            contact.name = contactName;

            var phoneNumbers = [];
            phoneNumbers[0] = new ContactField('work', phone, false);
            contact.phoneNumbers = phoneNumbers;

            var emails = [];
            emails[0] = new ContactField('work', email, true);
            contact.emails = emails;

            contact.save(app.onContactSaved, app.onContactSavedError);
        }
    },
    onContactFindError : function(contactError) {
        alert("onContactFindError :: " + contactError.code);
    },


    //CAMERA

    onCameraSuccess: function (imageData) {
        var d = new Date();
        var msg = prompt("Saisissez votre texte (optionnel) :");
        //<span class="img-date">' + d.getDate(); + '/' + d.getMonth() + '/' + d.getFullYear() + '</span>
        var img = '<figure class="img-projet">' +
            '<img src="' + imageData + '"">' +
            '<figcaption><p>' + msg + '</p></figcaption>' +
        '</figure>';

        $('#flux').prepend(img);
    },

    onCameraFail: function (error) {
        return;
    },

    takePicture: function (evt) {
        evt.preventDefault();
        var cameraOptions = {
            targetWidth: 300,
            targetHeight: 400,
            quality: 50,
            saveToPhotoAlbum: true,
            allowEdit: true
        };

        navigator.camera.getPicture(app.onCameraSuccess, app.onCameraFail, cameraOptions);
    },

    choosePicture: function (source) {
        var chooseOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: source 
        };
        navigator.camera.getPicture(app.onCameraSuccess, app.onCameraFail, chooseOptions);
    },

    choosePictureAlbum: function (evt) {
        evt.preventDefault();
        app.choosePicture(Camera.PictureSourceType.PHOTOLIBRARY);
    },

    analytics: function () {
        analytics.startTrackerWithId('UA-50987453-1');
        analytics.trackView('Home');
    },

    contacts: function () {
        $.getJSON( baseUrlJson + "contacts.json", function( data ) {
            $.each(data.contacts, function(key, val){
                $('#contactEmails').prepend('<li><div><span class="nom">' + val.nom + '</span> <span class="prenom">' + val.prenom + '</span></div><div><span class="fonction">' + val.fonction + '</span></div><div><span class="email">' + val.email + '</span></div><div><span class="phone">' + val.phone + '</span></div></li>');
            });
        });

        var saveContactButton = document.getElementById('saveContactButton');
        saveContactButton.addEventListener('click', app.saveContact, true);
    },

    camera: function () {
        var takePictureButton = document.getElementById('takePicture');
        takePictureButton.addEventListener('click', app.takePicture, true);

        var choosePictureAlbum = document.getElementById('choosePictureAlbum');
        choosePictureAlbum.addEventListener('click', app.choosePictureAlbum, true);
    },

    // CONNEXION
    connexionOnline: function () {
        //alert('Vous êtes bien connecté');
        $('#buttonMap').attr('href', '#map');
        $('body').off("click", '#buttonMap');
    },

    connexionOffline: function () {
        //alert('Connection perdue');
        $('#buttonMap').attr('href', '');
        $('body').on("click", '#buttonMap', function(){alert('Aucune connexion')});
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        // navigator.globalization.getPreferredLanguage(
        //     function (language) {
        //         alert(language.value);
        //         app.i18nInit(language.value);
        //         $('#select-language option[value="' + language.value + '"]').prop('selected', true);
        //         $('#select-language').selectmenu('refresh');
        //     },
        //     function () {alert('Error getting language\n');}
        // );
        
        // $("#select-language").change(function() {
        //     alert($(this).val());
        //     app.i18nInit($(this).val());
        // });
        document.addEventListener("online", app.connexionOnline, false);
        document.addEventListener("offline", app.connexionOffline, false);
        app.contacts();
        app.camera();   
        app.analytics();

        $("#map").on('pagecreate', app.initializeMap);     
    }
};
