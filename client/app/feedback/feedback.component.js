'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './feedback.routes';

export class FeedbackComponent {
    /*@ngInject*/
    constructor($http) {
        this.message = 'Hello';
        this.$http = $http;
    }

    submitFeedback() {
        console.log(this.feedback);
        this.$http.post('https://iztny1a59j.execute-api.us-west-2.amazonaws.com/production', this.feedback)
            .then(response => {
                console.log(response);
                console.log(response.data);
                if (response.data === null) {
                    this.feedback = {};
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export default angular.module('projections2040App.feedback', [uiRouter])
    .config(routes)
    .component('feedback', {
        template: require('./feedback.html'),
        controller: FeedbackComponent,
        controllerAs: 'feedbackCtrl'
    })
    .name;