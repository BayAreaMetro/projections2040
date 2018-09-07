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
        this.geographyName = 'ssa';
        this.variableName = 'Total Households';
        this.currentName = 'Total Households';

        //Get Data for Category and Variable combo
        this.$http.get('https://open-data-demo.mtc.ca.gov/resource/5tik-mgwp.json?$select=category,variable&$group=category,variable&$order=category,variable')
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
            //https://open-data-demo.mtc.ca.gov/resource/pcwa-vbwz.json?$where=category=%27Total%20Jobs%27%20AND%20variable=%27Other%27%20AND%20county=%27Alameda%27%20AND%20source=%27Estimate%27%20OR%20source=%27Modeled%27%20OR%20source=%27Base%20Year%20B%27
            //this.$http.get('https://open-data-demo.mtc.ca.gov/resource/5tik-mgwp.json?category=' + category + '&variable=' + variable + '&county=' + county)
            //https://open-data-demo.mtc.ca.gov/resource/pcwa-vbwz.json
        this.$http.get("https://open-data-demo.mtc.ca.gov/resource/pcwa-vbwz.json?$where=category=" + "'" + category + "'" + " AND variable=" + "'" + variable + "'" + " AND county=" + "'" + county + "'" + " AND source <>'Base Year A'")
            .then(response => {
                console.log(response.data[0]);
                this.dataGroup = response.data[0].category;
                //console.log(this.dataGroup, ' Line 45');
                var responseData = response.data;

                //Get list of unique SSAs
                var uniqueNames = _.orderBy(_.uniq(_.map(responseData, 'jurisdiction')));
                var uniqueVariables = _.map(responseData, 'variable');

                // console.log(uniqueNames);

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
                // console.log(finalData[0]);


                // Calculate county totals
                var countyTotal = {};
                var year2005, year2015, year2020, year2025, year2030, year2035, year2040;
                countyTotal.name = county;
                countyTotal[2005] = _.sumBy(finalData, 2005);
                countyTotal[2010] = _.sumBy(finalData, 2010);
                countyTotal[2015] = _.sumBy(finalData, 2015);
                countyTotal[2020] = _.sumBy(finalData, 2020);
                countyTotal[2025] = _.sumBy(finalData, 2025);
                countyTotal[2030] = _.sumBy(finalData, 2030);
                countyTotal[2035] = _.sumBy(finalData, 2035);
                countyTotal[2040] = _.sumBy(finalData, 2040);

                this.finalData = finalData;
                //console.log(finalData);
                this.countyTotal = countyTotal;
                this.updateVariableList();

            });

    }

    updateTable() {
        var county = this.countyName;
        var category = this.dataGroup;
        var variable = this.variableName;
        var geography = this.geographyName;
        var apiURL;
        this.currentName = this.variableName;
        //console.log(geography);
        //console.log(this.variableStore);
        //console.log(category)

        if (geography === 'jurisdiction') {
            apiURL = 'https://open-data-demo.mtc.ca.gov/resource/pcwa-vbwz.json';
        } else
        if (geography === 'ssa') {
            apiURL = 'https://open-data-demo.mtc.ca.gov/resource/5tik-mgwp.json';
        } else if (geography === 'pda') {
            apiURL = 'https://open-data-demo.mtc.ca.gov/resource/bt2d-fhg7.json';
        }
        //console.log('running');
        //console.log(apiURL + '?category=' + category + '&variable=' + variable + '&county=' + county);
        this.$http.get(apiURL + "?$where=category=" + "'" + category + "'" + " AND variable=" + "'" + variable + "'" + " AND county=" + "'" + county + "'" + " AND source <>'Base Year A'")
            //this.$http.get(apiURL + '?category=' + category + '&variable=' + variable + '&county=' + county)
            .then(response => {
                //console.log(response.data, ' Line 120');
                this.dataGroup = response.data[0].category;
                //console.log(this.dataGroup, ' Line 122');
                var responseData = response.data;
                this.variableDataStore = responseData;
                //console.log(this.variableDataStore);
                var uniqueNames = [];

                if (geography === 'ssa') {
                    uniqueNames = _.orderBy(_.uniq(_.map(responseData, 'ssa')));
                } else if (geography === 'jurisdiction') {
                    uniqueNames = _.orderBy(_.uniq(_.map(responseData, 'juris')));
                }


                var finalData = []; //Array for collecting all the SSA data by year for given variable type
                var geoByYear = {}; //Object containing an individual SSA and the yearly values for given variable

                // Loop through unique SSA values
                uniqueNames.forEach(element => {
                    var geoByYear = {};
                    geoByYear.name = element;
                    //console.log(element);
                    //geoByYear.sort = element;
                    // Loop through response data
                    if (geography === 'ssa') {
                        for (const key in responseData) {
                            if (responseData[key].ssa === element) {
                                var year = responseData[key].year;
                                var sort = 'sortOrder';
                                geoByYear[year] = Math.round(responseData[key].value);
                                geoByYear[sort] = Math.round(responseData[key].sort_order);
                            }
                        }
                    } else if (geography === 'jurisdiction') {
                        for (const key in responseData) {
                            if (responseData[key].juris === element) {
                                var year = responseData[key].year;
                                var sort = 'sortOrder';
                                geoByYear[year] = Math.round(responseData[key].value);
                                geoByYear[sort] = Math.round(responseData[key].sort_order);
                                //console.log(geoByYear);
                            }
                        }
                    }
                    finalData.push(geoByYear);
                    //console.log(geoByYear);
                });


                // Calculate county totals
                var countyTotal = {};
                var year2005, year2015, year2020, year2025, year2030, year2035, year2040;
                countyTotal.name = county;
                countyTotal[2005] = _.sumBy(finalData, 2005);
                countyTotal[2010] = _.sumBy(finalData, 2010);
                countyTotal[2015] = _.sumBy(finalData, 2015);
                countyTotal[2020] = _.sumBy(finalData, 2020);
                countyTotal[2025] = _.sumBy(finalData, 2025);
                countyTotal[2030] = _.sumBy(finalData, 2030);
                countyTotal[2035] = _.sumBy(finalData, 2035);
                countyTotal[2040] = _.sumBy(finalData, 2040);

                // Set scope variables
                this.finalData = finalData;
                //console.log(finalData);
                this.countyTotal = countyTotal;


            });

    }

    updateVariableList() {
        //console.log('Variable List Updated');
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