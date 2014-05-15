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
        $.getJSON("address.json", function (address) {
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
        alert('init map');
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
    saveContact: function() {
        
        $('#contactEmails').children().each(function(){
            
              var name = $(this).find('.nom').html();
              var surname = $(this).find('.prenom').html();
              var phone = $(this).find('.phone').html();
              var email = $(this).find('.email').html();
              
              var options = new ContactFindOptions();
              options.filter = name;
              options.multiple = true;
              var fields = ["displayName", "nickname", "name", "phoneNumbers", "emails"];
              var test = navigator.contacts.find(fields, onContactFindSuccess, this.onContactFindError, options);
              
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
                  
                      contact.save(this.onContactSaved, this.onContactSavedError);
                  }
              }

        });
        alert('Contact non existant importé');
    },
    onContactSavedError : function(error) {
        alert("onContactSavedError :: " + error.code);
    },
    onContactSaved : function() {
        alert("onContactSaved !");
    },
    onContactFindSuccess: function(contacts) {
        var contactEmailsElement = document.getElementById('contactEmails');
        contactEmailsElement.innerHTML = '';
        for (var i = 0; i < contacts.length; i++) {
            var contact = contacts[i];
            var opt = document.createElement('li');
            opt.setAttribute('value', contact.displayName);
            opt.setAttribute('class', 'ui-li-static ui-body-inherit ui-last-child');
            var email = '';
            for (var j = 0; j < contact.emails.length; j++) {
                email = contact.emails[j].value;
            }
            opt.innerHTML = contact.name.givenName + ' ' + contact.name.familyName + ' : ' + email;
            contactEmailsElement.appendChild(opt);
        }
        var opt = document.createElement('li');
        opt.setAttribute('value', 'Loaded!');
        opt.setAttribute('class', 'ui-li-static ui-body-inherit ui-last-child');
        opt.innerHTML = 'Loaded!';
        contactEmailsElement.appendChild(opt);
    },
    onContactFindError : function(contactError) {
        alert("onContactFindError :: " + contactError.code);
    },
    cameraOptions: {
        targetWidth: 300,
        targetHeight: 400,
        saveToPhotoAlbum: true,
        allowEdit: true
    },
    takePicture: function(evt) {
        evt.preventDefault();
        navigator.camera.getPicture(this.onCameraSuccess, this.onCameraError, this.cameraOptions);
    },
    onCameraSuccess: function(imageData){
        alert("onCameraSuccess");
        document.querySelector('#shot').src = imageData;
    },
    onCameraError: function(error){
        alert("onCameraError (maybe on Simulator: camera disabled!) :: " + error.code);
    },
    updatePreferences: function(evt){
        evt.preventDefault();
        app.cameraOptions[evt.target.id] = evt.target.checked;
    },
    onChoosePictureURISuccess: function(imageURI) {
        $('#flux').append('<img src="' + imageURI + '" />').append(prompt("Saisissez votre texte (optionnel) :"));
    },
    onChoosePictureError: function(error){
        alert("onChoosePictureError :: " + error.code);
    },
    choosePicture: function(source) {
        navigator.camera.getPicture(this.onChoosePictureURISuccess, this.onChoosePictureError,
                                    { quality: 50,
                                    destinationType: Camera.DestinationType.FILE_URI,
                                    sourceType: source });
    },
    choosePictureAlbum: function(e) {
        app.choosePicture(Camera.PictureSourceType.PHOTOLIBRARY);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        analytics.startTrackerWithId('UA-50987453-1');
        analytics.trackView('Home');

        navigator.globalization.getPreferredLanguage(
            function (language) {
                alert(language.value);
                app.i18nInit(language.value);
                $('#select-language option[value="' + language.value + '"]').prop('selected', true);
                $('#select-language').selectmenu('refresh');
            },
            function () {alert('Error getting language\n');}
        );

        $.getJSON( "contacts.json", function( data ) {
                  $.each(data.contacts, function(key, val){
                         $('#contactEmails').prepend('<li><div><span class="nom">' + val.nom + '</span> <span class="prenom">' + val.prenom + '</span></div><div><span class="fonction">' + val.fonction + '</span></div><div><span class="email">' + val.email + '</span></div><div><span class="phone">' + val.phone + '</span></div></li>');
                   });
        });
        
        $("#map").on('pagecreate', app.initializeMap);
        $("#select-language").change(function() {
            alert($(this).val());
            app.i18nInit($(this).val());
        });
        

        var saveContactButton = document.getElementById('saveContactButton');
        saveContactButton.addEventListener('click', function(event) { app.saveContact(event); }, true);
        
        var takePictureButton = document.getElementById('takePicture');
        takePictureButton.addEventListener('click', function(event) { app.takePicture(event); }, true);

        var choosePictureAlbum = document.getElementById('choosePictureAlbum');

        choosePictureAlbum.addEventListener('click', function(event) { app.choosePictureAlbum(event); }, true);
        

        app.receivedEvent('deviceready');
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        var item = document.getElementById('modalLauncher');
        item.setAttribute('href', '#myModal');

        console.log('Received Event: ' + id);
    }
};
