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


            // var erURL = 'https://open-data-demo.mtc.ca.gov/resource/a9wr-wcu4.json';

            // this.$http.get(erURL)
            //     .then(response => {
            //         console.log(response.data);
            //         this.EmployedResidents = response.data
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     })




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
    filterViz() {

    }
}

export default angular.module('projections2040App.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.html'),
        controller: MainController
    })
    .name;