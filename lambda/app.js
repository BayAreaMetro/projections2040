var request = require('request');
var github = require('octonode');

var client = github.client({
    username: process.env.GITHUB_USER,
    password: process.env.GITHUB_PWD
});

var ghrepo = client.repo(process.env.GITHUB_REPO)


exports.handler = function(event, context, callback) {
    // var data = event.body;
    console.log(event.inputComment);

    ghrepo.issue({
        "title": "Public Comment",
        "body": event.inputComment,
        "assignee": "MTCGIS",
        "labels": [event.inputType]
    }, function(err, data, headers) {
        if (err) {
            console.log(err)

        }

    }); //issue
    console.log('its working');
};