'use strict';
const angular = require('angular');
var searchParams = {};
var countyLookup = [{
    name: 'Alameda',
    shortFIP: 1,
    longFIP: 6001
}, {
    name: 'Contra Costa',
    shortFIP: 13,
    longFIP: 6013
}, {
    name: 'Marin',
    shortFIP: 41,
    longFIP: 6041
}, {
    name: 'Napa',
    shortFIP: 55,
    longFIP: 6055
}, {
    name: 'San Francisco',
    shortFIP: 75,
    longFIP: 6075
}, {
    name: 'San Mateo',
    shortFIP: 81,
    longFIP: 6081
}, {
    name: 'Santa Clara',
    shortFIP: 85,
    longFIP: 6085
}, {
    name: 'Solano',
    shortFIP: 95,
    longFIP: 6095
}, {
    name: 'Sonoma',
    shortFIP: 97,
    longFIP: 6097
}];
/*@ngInject*/
export function dataServiceService() {
    //Get and set search parameters
    this.setParams = function(params) {
        searchParams = params;
    }

    this.getParams = function() {
        return searchParams;
    }

    this.getCountyLookup = function() {
        return countyLookup;
    }
}

export default angular.module('projections2040App.dataService', [])
    .service('dataService', dataServiceService)
    .name;