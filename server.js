const express = require('express');
const db = require('./db')
const swig = require('swig');
swig.setDefaults({cache: false});
// const bodyParser = require('body-parser');

const app = express();

app.use(require('body-parser').urlencoded({ extended: false }));

app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.get('/', function(req, res, next) {
    db.Story.findAll()
        .then(function(stories){
           res.render('index', { stories: stories })
        });
});


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

