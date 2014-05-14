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

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //document.addEventListener('deviceready', , false);
        
        $("#map").on('pagecreate', app.initializeMap);

        //google.maps.event.addDomListener(window, 'load', app.initializeMap);
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};
