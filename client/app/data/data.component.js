'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './data.routes';

export class DataComponent {
    /*@ngInject*/
    constructor($http, $state, dataService) {
        this.$http = $http;
        this.$state = $state;
        this.dataService = dataService;
    }

    $onInit() {
        //Initial Filter
        var county = 'Alameda';
        var variable = 'Total Households';
        var category = 'Households';
        this.county = county;
        this.variable = variable;
        this.category = category;
        //Set Filter Control Selection Values
        this.dataGroup = 'Households';
        this.countyName = 'Alameda';
        this.geographyName = 'jurisdiction';
        this.variableName = 'Total Households';
        this.currentName = 'Total Households';

        //Get Data for Category and Variable combo
        this.$http.get('https://data.bayareametro.gov/resource/grqz-amra.json?$select=category,variable&$group=category,variable&$order=category,variable')
            .then(response => {
                //console.log(response.data);
                this.variableStore = response.data;
                this.variableStoreComplete = response.data;
                this.updateVariableList();
            })
            .catch(err => {
                console.log(err);
            })
            //Build Data Table Store from Initial Filter
            //Uses where clause Instead

        this.$http.get("https://data.bayareametro.gov/resource/grqz-amra.json?$where=category=" + "'" + category + "'" + " AND variable=" + "'" + variable + "'" + " AND county=" + "'" + county + "'" + " AND source <>'Base Year A'")
            .then(response => {
                console.log(response.data[0]);
                this.dataGroup = response.data[0].category;
                //console.log(this.dataGroup, ' Line 45');
                var responseData = response.data;

                //Get list of unique SSAs
                var uniqueNames = _.orderBy(_.uniq(_.map(responseData, 'jurisdiction')));
                var uniqueVariables = _.map(responseData, 'variable');

                console.log(uniqueNames);

                var finalData = []; //Array for collecting all the SSA data by year for given variable type
                var geoByYear = {}; //Object containing an individual SSA and the yearly values for given variable

                // Loop through unique SSA values
                uniqueNames.forEach(element => {
                    var geoByYear = {};
                    geoByYear.name = element;

                    for (const key in responseData) {
                        if (responseData[key].ssa === element) {
                            var year = responseData[key].year;
                            var sort = 'sortOrder';
                            geoByYear[year] = Math.round(responseData[key].value);
                            geoByYear[sort] = Math.round(responseData[key].sort_order);
                        }
                    }
                    finalData.push(geoByYear);
                });



                this.finalData = finalData;
                //console.log(finalData);
                this.updateVariableList();

            });
        this.updateTable();
    }

    updateTable() {
        var county = this.countyName;
        var category = this.dataGroup;
        var variable = this.variableName;
        var geography = 'jurisdiction';
        var apiURL;
        this.currentName = this.variableName;


        if (geography === 'jurisdiction') {
            apiURL = 'https://data.bayareametro.gov/resource/grqz-amra.json';
        } else
        if (geography === 'ssa') {
            apiURL = 'https://data.bayareametro.gov/resource/grqz-amra.json';
        } else if (geography === 'pda') {
            apiURL = 'https://data.bayareametro.gov/resource/grqz-amra.json';
        }

        this.$http.get(apiURL + "?$where=category=" + "'" + category + "'" + " AND variable=" + "'" + variable + "'" + " AND county=" + "'" + county + "'" + " AND source <>'Base Year A'")
            .then(response => {
                this.dataGroup = response.data[0].category;
                var responseData = response.data;
                this.variableDataStore = responseData;
                var uniqueNames = [];

                if (geography === 'jurisdiction') {
                    uniqueNames = _.orderBy(_.uniq(_.map(responseData, 'jurisdiction')));
                    console.log(uniqueNames);
                }


                var finalData = []; //Array for collecting all the SSA data by year for given variable type
                var geoByYear = {}; //Object containing an individual SSA and the yearly values for given variable

                // Loop through unique SSA values
                uniqueNames.forEach(element => {
                    var geoByYear = {};
                    var city = element;


                    // Loop through response data
                    if (geography === 'ssa') {
                        for (const key in responseData) {
                            if (responseData[key].ssa === city) {
                                var year = responseData[key].year;
                                var sort = 'sortOrder';
                                geoByYear.name = city;
                                geoByYear[year] = Math.round(responseData[key].value);
                                geoByYear[sort] = Math.round(responseData[key].sort_order);

                            }
                        }
                    } else if (geography === 'jurisdiction') {
                        for (const key in responseData) {
                            if (responseData[key].jurisdiction === city) {
                                var year = responseData[key].year;
                                var sort = 'sortOrder';
                                geoByYear.name = city;
                                geoByYear[year] = Math.round(responseData[key].value);
                                geoByYear[sort] = Math.round(responseData[key].sort_order);

                                //console.log(geoByYear);
                            }
                        }
                    }
                    finalData.push(geoByYear);
                    // console.log(finalData);
                });
                console.log(finalData);


                // Set scope variables
                this.finalData = finalData;


            });

    }

    updateVariableList() {
        this.variableStore = _.filter(this.variableStoreComplete, { 'category': this.dataGroup });
    }

    mapView() {
        var params = {
            geography: this.geographyName,
            variable: this.variableName,
            county: this.countyName
        }
        this.dataService.setParams(params)
        this.$state.go('map');
    }
}

export default angular.module('projections2040App.data', [uiRouter])
    .config(routes)
    .component('data', {
        template: require('./data.html'),
        controller: DataComponent,
        controllerAs: 'dataCtrl'
    })
    .name;