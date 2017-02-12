const express = require('express');
const db = require('./db');
const Author = db.Author;
const Story = db.Story;
const swig = require('swig');
swig.setDefaults({cache: false});

const app = express();

app.use(require('body-parser').urlencoded({ extended: false }));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.get('/', function(req, res, next) {
    Story.findAll({include : [ Author ]})
        .then(function(stories){
           res.render('index', { stories: stories })
        });
});

app.post('/', function(req, res, next) {
    var authorName = req.body.author;
    var storyTitle = req.body.title;
    var storyContent = req.body.content;

    Story.createStory(authorName, storyTitle, storyContent) // this is a promise somehow
        .then(function(story){
            res.redirect('/');
        })
        .catch(function(err) {
            console.log(err);
        });
});


// get all stories from specified user
app.get('/:name', function(req, res, next) {
    var name = req.params.name;
    Story.getStories(name)
        .then(function(selectStories) {
            console.log(selectStories);
            res.render('index', { stories : selectStories });
        });
});


// get a story based on title
app.get('/:name/:title', function(req, res, next) {
    var title = req.params.title;
    var name = req.params.name;
    // res.send(name, title);
    Story.getStory(title, name)
        .then(function(story) {
            res.render('index', { stories : story });
        });
});


// error umbrella catches all
app.use(function(err, req, res, next) {
    res.send('Houston we got a problem:', err);
})

const port = process.env.PORT || 3000;

db.sync()
    .then(function() {
        console.log('we are running!');
    })
    .then(function() {
        db.seed();
    });


app.listen(port, function() {
    console.log(`listens on port ${port}`);
});

