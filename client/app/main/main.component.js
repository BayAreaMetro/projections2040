import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
    $http;

    awesomeThings = [];

    /*@ngInject*/
    constructor($http) {
        this.$http = $http;
    }

    $onInit() {

            //Initialize Tableau
            var viz, dataviz;

            //setting up the Divs


            //setting up the URLs






            function initViz() {
            //https://public.tableau.com/views/Demographics_37/ChartView?:showVizHome=no
                var vizDiv = document.getElementById("vizContainer"),
                    chartURL = "https://public.tableau.com/views/Demographics_37/ChartView?:showVizHome=no",
                    options = {
                        hideTabs: true,
                        onFirstInteractive: function() {
                            //console.log("Loading ChartViz");
                        }

                    };
                viz = new tableau.Viz(vizDiv, chartURL, options);
                return viz;

            }

            function initDataViz() {

                var dataDiv = document.getElementById("dataContainer"),
                    dataURL = "https://public.tableau.com/views/Demographics_37/DataView?:showVizHome=no",
                    doptions = {
                        hideTabs: true,
                        onFirstInteractive: function() {
                            //console.log("Loading DataViz");
                        }

                    };
                dataviz = new tableau.Viz(dataDiv, dataURL, doptions);
                return dataviz;

            }


            //Set Global viz variable

            this.viz = initViz();
            //this.dataviz = initDataViz();
            //console.log(dataviz);


            // JQUERY Functions
            (function($) {
                "use strict"; // Start of use strict

                // Smooth scrolling using jQuery easing
                $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
                    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                        if (target.length) {
                            $('html, body').animate({
                                scrollTop: (target.offset().top - 48)
                            }, 1000, "easeInOutExpo");
                            return false;
                        }
                    }
                });

                // Closes responsive menu when a scroll trigger link is clicked
                $('.js-scroll-trigger').click(function() {
                    $('.navbar-collapse').collapse('hide');
                });

                // Activate scrollspy to add active class to navbar items on scroll
                $('body').scrollspy({
                    target: '#mainNav',
                    offset: 54
                });

                // Collapse Navbar
                var navbarCollapse = function() {
                    if ($("#mainNav").offset().top > 100) {
                        $("#mainNav").addClass("navbar-shrink");
                    } else {
                        $("#mainNav").removeClass("navbar-shrink");
                    }
                };
                // Collapse now if page is not at top
                navbarCollapse();
                // Collapse the navbar when page is scrolled
                $(window).scroll(navbarCollapse);

            })(jQuery); // End of use strict


            this.$http.get('/api/things')
                .then(response => {
                    this.awesomeThings = response.data;
                });
        }
        //Function for getting data from Socrata Summary Views
    updateChart() {

        // var chartSelection = this.chartVariable;
        // var dataURL;
        // var chartdata;

        // if (chartSelection == 'Employed Residents') {
        //     dataURL = 'https://open-data-demo.mtc.ca.gov/resource/a9wr-wcu4.json';
        // } else if (chartSelection == 'Household Population') {
        //     dataURL = 'https://open-data-demo.mtc.ca.gov/resource/vzgz-d2f7.json';
        // } else if (chartSelection == 'Total Households') {
        //     dataURL = 'https://open-data-demo.mtc.ca.gov/resource/vzgz-d2f7.json';
        // }


        // this.$http.get(dataURL)
        //     .then(response => {
        //         console.log(response.data);
        //         this.chartdata = response.data
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }

    //Filters Tableau Chart based on values returned from Drop Down List 
    filterViz(v) {
        // console.log(this.updateChartParameter);
        //console.log(v.currentTarget.attributes.value.nodeValue);
        var updateParameter = v.currentTarget.attributes.value.nodeValue;
        //console.log(updateParameter);
        var sheet = this.viz.getWorkbook().getActiveSheet();
        if (updateParameter === "") {
            sheet.clearFilterAsync("Category");
        } else {
            sheet.applyFilterAsync("Category", updateParameter, tableau.FilterUpdateType.REPLACE);
        }

    }
}

export default angular.module('projections2040App.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.html'),
        controller: MainController
    })
    .name;