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
var token;
var myMarker;
var baseUrlJson = 'http://37.187.2.11/appli/';
var lang = 'en_US';
var accelerometerOption = 'true';
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

    i18nInit: function() {
        jQuery.i18n.properties({
            name: 'Messages', 
            path: 'lang/', 
            mode: 'map',
            language: lang, 
            callback: function () {
                // Accessing a simple value through the map
                $('[data-i18n]').each(function () {
                    var $elm = $(this);
                    var prop = $elm.data('i18n');
                    $elm.text($.i18n.prop(prop));
                });
            }
        });       

    },
    
    onMapSuccess: function(position) {
        var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if (myMarker) {
            myMarker.setPosition(myLatlng);
        } else {
            myMarker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: "Position"
            });
        }
        $('#geoloc').html('LAT: ' + position.coords.latitude + ' / LONG: ' + position.coords.longitude);
    },

    onMapError: function(error) {
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

        var watchID = navigator.geolocation.watchPosition(app.onMapSuccess, app.onMapError);


        function onSuccess(heading) {
            var nord = 360 - heading.magneticHeading;
            $('#compass').css({
                'transform':'rotate(' + nord + 'deg)',
                '-ms-transform':'rotate(' + nord + 'deg)',
                '-webkit-transform':'rotate(' + nord + 'deg)'
            });
        };

        function onError(compassError) {
            
        };

        var options = {
            frequency: 50
        };

        var watchCompass = navigator.compass.watchHeading(onSuccess, onError, options);
        
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
        var msg = 'Les contats ont bien été ajoutés';
        navigator.notification.vibrate(500);
        alert(msg);
    },
    onContactSavedError : function(error) {
        alert("Impossible de sauvegarder les contacts <br> Errreur " + error.code);
    },
    onContactSaved : function() {
       /** var msg = 'Les contats ont bien été ajoutés';
        navigator.notification.vibrate(500);
        alert(msg);**/
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
        alert("Impossible de trouver les contacts :: " + contactError.code);
    },


    //CAMERA
    share: function () {
        var imageData = $(this).closest('figure').find('img').attr("src");
        var msg = $(this).closest('figure').find('figcaption p').text();
        window.plugins.socialsharing.share(msg, null,  imageData, null);

    },


    onCameraSuccess: function (imageData) {
        var d = new Date();
        var msg = prompt("Saisissez votre texte (optionnel) :");
        //<span class="img-date">' + d.getDate(); + '/' + d.getMonth() + '/' + d.getFullYear() + '</span>
        var img = '<figure class="img-projet">' +
            '<img id="myImg" src="data:image/jpeg;base64,' + imageData + '">' +
            '<figcaption><p>' + msg + '</p><button class="ui-btn ui-btn-inline ui-shadow ui-corner-all share" type="button" >Share</button></figcaption>' +
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
            allowEdit: true,
            destinationType: Camera.DestinationType.DATA_URL
        };

        navigator.camera.getPicture(app.onCameraSuccess, app.onCameraFail, cameraOptions);
    },

    choosePicture: function (source) {
        var chooseOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
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
            //supprime le texte de subsitution
            $('#contactEmails').html('');
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

        $('#camera').on('click' ,'.share', app.share);
    },

    // CONNEXION
    connexionOnline: function () {
        //alert('Vous êtes bien connecté');
        $('#.uttonMap').attr('href', '#map');
        $('body').off("click", '.buttonMap');
    },

    connexionOffline: function () {
        //alert('Connection perdue');
        $('.buttonMap').attr('href', '');
        $('body').off("click", '.buttonMap');
        $('body').on("click", '.buttonMap', function(){alert('Aucune connexion')});
    },

    calendar: function (){
        var permanentStorage = window.localStorage;
        var langDate;

        if (lang.indexOf("fr") != -1) {
            langDate = "fr";
        } else if (lang.indexOf("fr") != -1) {
            langDate = "en";
        } else {
            langDate = lang;
        }
        $.ajax({
            type: "GET",
            url: baseUrlJson + "planning.json",
            dataType: 'text'
        }).done(function(data){
            permanentStorage.setItem("eventsCalendar", data);
        }).always(function(){
            $('#calendar').fullCalendar({
                defaultView: 'agendaWeek',
                header: {
                    left:  'prev',
                    center: 'today',
                    right: 'next'
                },
                minTime: '08:00:00',
                aspectRatio: $('body').width()/($('body').height() - $('[data-role=header]').outerHeight() - $('[data-role=footer]').outerHeight()),
                lang: langDate,
                events: $.parseJSON(window.localStorage.getItem("eventsCalendar"))
            });
        });
    },
    accelerometer: function() {
        function onSuccess(acceleration) {
                var accelerationTotal = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);

                if(accelerationTotal > 20 && accelerometerOption == 'true') {
                    $.mobile.back();
                }
        };

        function onError() {
            
        };

        var options = { frequency: 200 };

        var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    },
    

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        navigator.globalization.getLocaleName(
            function (language) {
                lang = language.value;
                app.i18nInit();
                $('#select-language option[value="' + language.value + '"]').prop('selected', true);
                $('#parameter').on('pagecreate', function () {
                    $('#select-language').selectmenu('refresh', true);
                });
            },
            function () {alert('Error getting language\n');}
        );
        
        $("#select-language").change(function() {
            lang = $(this).val();
            app.i18nInit();

            //Force l'actualisation du parametre de l'accéléromètre pour le traduire
            $('#select-accelerometer').selectmenu('refresh', true);

            //Changement de langue du calendrier
            $('#calendar').fullCalendar('destroy');
            app.calendar();
        });

        $('#select-accelerometer').change(function(){
            accelerometerOption = $(this).val();
        });

        document.addEventListener("online", app.connexionOnline, false);
        document.addEventListener("offline", app.connexionOffline, false);
        app.contacts();
        app.camera();   
        app.analytics();
        app.calendar();
        app.accelerometer();

        $("#map").on('pagecreate', app.initializeMap);
        $("#calendarContainer").on('pageshow', function(){
            $('.fc-button-today').trigger('click');
        });
    }
};
