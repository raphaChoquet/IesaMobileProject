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




    // GEOLOC: << BEGIN
    // onSuccess Callback
    //   This method accepts a `Position` object, which contains
    //   the current GPS coordinates
    //
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

    // onError Callback receives a PositionError object
    //
    onError: function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },

    initmarkers: function(map) {
        $.getJSON("address.json", function (address) {
            alert(address[0]['name']);
            var markers = [];
            for (var i = 0; i < address.length; i++) {
                var myLatlng = new google.maps.LatLng(address[i].lat, address[i].long);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: address[i].name
                });

                markers.push(marker);
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
        // Options: throw an error if no update is received every 30 seconds.
        //

        var watchID = navigator.geolocation.watchPosition(app.onSuccess, app.onError);
    },
    // GEOLOC: << END


    // CONTACTSAPI:6/7 << BEGIN
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
            //if (contact.displayName) opt.innerHTML = opt.innerHTML + '#' + contact.displayName;
            //if (contact.nickName) opt.innerHTML = opt.innerHTML + '#' + contact.nickName;
            //if (contact.name.givenName) opt.innerHTML = opt.innerHTML + ' # ' + contact.name.givenName;
            //if (contact.name.familyName) opt.innerHTML = opt.innerHTML + ' # ' + contact.name.familyName;
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
    // CONTACTSAPI:7/7 << END

    // CAMERAAPI:6/6 << BEGIN
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
        //navigator.notification.alert(error, null);
        alert("onCameraError (maybe on Simulator: camera disabled!) :: " + error.code);
    },
    updatePreferences: function(evt){
        evt.preventDefault();
        app.cameraOptions[evt.target.id] = evt.target.checked;
    },
    onChoosePictureURISuccess: function(imageURI) {
        // Uncomment to view the image file URI
        // console.log(imageURI);
        var image = document.querySelector('#shot');
        image.style.display = 'block';
        image.src = imageURI;
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
    choosePictureLibrary: function(e) {
        app.choosePicture(Camera.PictureSourceType.PHOTOLIBRARY);
    },
    choosePictureAlbum: function(e) {
        app.choosePicture(Camera.PictureSourceType.SAVEDPHOTOALBUM);
    },
    // CAMERAAPI:6/6 << END

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        
        $.getJSON( "contacts.json", function( data ) {
                  $.each(data.contacts, function(key, val){
                         $('#contactEmails').prepend('<li><div class="pull-left"><input type="checkbox"></div><div><span class="nom">' + val.nom + '</span> <span class="prenom">' + val.prenom + '</span></div><div><span class="fonction">' + val.fonction + '</span></div><div><span class="email">' + val.email + '</span></div><div><span class="phone">' + val.phone + '</span></div></li>');
                   });
        });
        
        $("#map").on('pagecreate', app.initializeMap);
        $("#map").on('pagecreate', function () {
            alert('mapCreate');
        });

        // CONTACTSAPI:5/7
       /* var loadContactButton = document.getElementById('loadContactButton');
        loadContactButton.addEventListener('click', function(event) { app.loadContact(event); }, true);*/
        var saveContactButton = document.getElementById('saveContactButton');
        saveContactButton.addEventListener('click', function(event) { app.saveContact(event); }, true);
        
        // CAMERAAPI:5/6
        var takePictureButton = document.getElementById('takePicture');
        takePictureButton.addEventListener('click', function(event) { app.takePicture(event); }, true);
        var saveToPhotoAlbum = document.querySelector('#saveToPhotoAlbum');
        saveToPhotoAlbum.addEventListener('change', app.updatePreferences);
        var allowEdit = document.querySelector('#allowEdit');
        allowEdit.addEventListener('change', app.updatePreferences);
        var choosePictureAlbum = document.getElementById('choosePictureAlbum');
        choosePictureAlbum.addEventListener('click', function(event) { app.choosePictureAlbum(event); }, true);
        var choosePictureLibrary = document.getElementById('choosePictureLibrary');
        choosePictureLibrary.addEventListener('click', function(event) { app.choosePictureLibrary(event); }, true);
        

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
