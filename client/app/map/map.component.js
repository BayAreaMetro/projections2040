'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './map.routes';

export class MapComponent {
    /*@ngInject*/
    // Layer variable names (loaded in _index.html)
    /*      
        Subregional Study Areas = ssas
        Unincorporated Counties = unincorporatedCounties
        Counties = counties
        Places = places

    */


    constructor($http, dataService, $state) {
        this.$http = $http;
        this.$state = $state;
        this.dataService = dataService;
    }

    $onInit() {

        // Retrieve Search Parameters
        this.params = this.dataService.getParams();
        var params = this.params;
        var countyFIP;

        //Get county FIPS lookup
        var countyLookup = this.dataService.getCountyLookup();
        console.log(countyLookup);

        console.log(params);
        if (!params.geography) {
            this.$state.go('data');
        }


        var map, mapFeatures, filterFeatures;
        //mapboxgl.accessToken = 'pk.eyJ1IjoibXppeWFtYmkiLCJhIjoid3dLMWFSWSJ9.hnKFXmWmSwyhsSJp6vucig';
        mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaGNyb2ZmIiwiYSI6IktobmJNQUEifQ.9JuIAa1Y4yvllmERw7-08g'; //MTC Mapbox Style access token
        map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/joshcroff/cjbeayb7i8qmt2smxtb17nqjq', // MTC Mapbox Style
            // style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
            // style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
            center: [-74.50, 40], // starting position [lng, lat]
            zoom: 8, // starting zoom
            attributionControl: false
        });
        // console.log(map);
        map.dragRotate.disable();

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.setCenter([-122.24164, 37.76521], 12);
        //ADD GEOCODER
        map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
        }));

        // console.log(places);
        map.on('load', function() {

            //Add Places
            map.addSource('placesSource', {
                    type: 'geojson',
                    data: places
                })
                .addLayer({
                    'id': 'placesLayer',
                    'type': 'fill',
                    'source': 'placesSource',
                    'layout': { 'visibility': 'none' },
                    'paint': {
                        'fill-color': 'orange',
                        'fill-opacity': 0.4,
                        'fill-outline-color': 'black'
                    }
                })

            //Add Counties
            map.addSource('countiesSource', {
                    type: 'geojson',
                    data: counties
                })
                .addLayer({
                    'id': 'countiesLayer',
                    'type': 'fill',
                    'source': 'placesSource',
                    'layout': { 'visibility': 'none' },
                    'paint': {
                        'fill-color': 'purple',
                        'fill-opacity': 0.4,
                        'fill-outline-color': 'black'
                    }
                })

            //Add SSAs
            map.addSource('ssasSource', {
                    type: 'geojson',
                    data: ssas
                })
                .addLayer({
                    'id': 'ssasLayer',
                    'type': 'fill',
                    'source': 'ssasSource',
                    'layout': { 'visibility': 'none' },
                    'paint': {
                        'fill-color': 'green',
                        'fill-opacity': 0.4,
                        'fill-outline-color': 'black'
                    }
                })

            // Add Unincorporatd Counties
            map.addSource('unincorporatedSource', {
                    type: 'geojson',
                    data: unincorporatedCounties
                })
                .addLayer({
                    'id': 'unincorporatedLayer',
                    'type': 'fill',
                    'source': 'unincorporatedSource',
                    'layout': { 'visibility': 'none' },
                    'paint': {
                        'fill-color': 'yellow',
                        'fill-opacity': 0.4,
                        'fill-outline-color': 'black'
                    }
                })
          map.addSource('dem', {
        "type": "raster-dem",
        "url": "mapbox://mapbox.terrain-rgb"
    }).addLayer({
        "id": "hillshading",
        "source": "dem",
        "type": "hillshade"
    // insert below waterway-river-canal-shadow;
    // where hillshading sits in the Mapbox Outdoors style
    }, 'waterway-river-canal-shadow');
})
            var countyFIP = _.filter(countyLookup, { 'name': params.county });
            if (params.geography === 'jurisdiction') {
                map.setFilter('placesLayer', ['==', 'CountyFIP', countyFIP[0].shortFIP]);
                map.setFilter('unincorporatedLayer', ['==', 'county_fip', countyFIP[0].longFIP]);
                map.setLayoutProperty('placesLayer', 'visibility', 'visible');
                map.setLayoutProperty('unincorporatedLayer', 'visibility', 'visible');
            } else if (params.geography === 'ssa') {
                map.setFilter('ssasLayer', ['==', 'fipco', countyFIP[0].longFIP]);
                map.setLayoutProperty('ssasLayer', 'visibility', 'visible');
            }

            // Zoom to county
            var allFeatures = map.getSource('countiesSource')._data.features; //Retrieve county data source
            //Filter data source based on county name
            var zoomToFeature = _.filter(allFeatures, function(item) {
                return item.properties.NAME === params.county;
            });

            //Get bounding box of filtered county and zoom to bounding box
            var bbox = turf.extent(zoomToFeature[0].geometry);
            map.fitBounds(bbox, { padding: 20 });
        })



        // this.map = map;


    }

}

export default angular.module('projections2040App.map', [uiRouter])
    .config(routes)
    .component('map', {
        template: require('./map.html'),
        controller: MapComponent,
        controllerAs: 'mapCtrl'
    })
    .name;
