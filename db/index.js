const Sequelize = require('Sequelize');
const db = new Sequelize(process.env.DATABASE_URL);

// model singular
const Story = db.define('story', {
      title: {
          type: Sequelize.STRING
              //db.Sequelize.STRING ?
      },
      content: {
          type: Sequelize.TEXT
      }
    },
    {
      classMethods: {  // whats getterMethods??
        createStory : function(authorName, title, content) {
          return Author.findOne({ where : { name : authorName }})
            .then(function(author) {
              if(author) {
                return author;
              } else {
                return Author.create({ name: authorName });
              }
            })
            .then(function(author) {
              return Story.create({title : title, content: content, authorId : author.id  });
            })
        }
        ,
        getStories : function(name) {
          let filter = {};
          if(name) {
            filter.name = name;
          }
          // returns a promise
          return Story.findAll({
            include : [ {
              model: Author,
              where: filter
            }]
          })
        },
        getStory : function(storyName, authorName) {
          // returns a promise
          return Story.findAll({
              where: {
                title: storyName
              },
              include : [{ // join Author where name = authorName
                model: Author,
                where: { name : authorName } // storyId..
              }]
          })
        }
      }
    });

const Author = db.define('author', {
    name: {
        type: Sequelize.STRING
    }
});

Story.belongsTo(Author);
Author.hasMany(Story);


const seed = function() {
  return connect()
      .then(function() {
      return Author.create({ name : 'Leonard' });
    })
    .then(function(author) {
      Story.createStory('Leonard', 'Title', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas maximus rhoncus blandit. Pellentesque tempus sapien condimentum elit suscipit ultricies. Praesent placerat finibus mattis. Sed quis cursus erat. Phasellus vitae nunc lorem. Nam feugiat vulputate mauris ac tristique. Phasellus non est finibus, facilisis erat a, tincidunt arcu. Vivamus elementum leo vel nulla vehicula dignissim.');
    })
    .then(function(author) {
      Story.createStory('Bob', 'Another', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas maximus rhoncus blandit. Pellentesque tempus sapien condimentum elit suscipit ultricies. Praesent placerat finibus mattis. Sed quis cursus erat. Phasellus vitae nunc lorem. Nam feugiat vulputate mauris ac tristique. Phasellus non est finibus, facilisis erat a, tincidunt arcu. Vivamus elementum leo vel nulla vehicula dignissim.');
    })
    .then(function(author) {
      Story.createStory('Evan', 'Another', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas maximus rhoncus blandit. Pellentesque tempus sapien condimentum elit suscipit ultricies. Praesent placerat finibus mattis. Sed quis cursus erat. Phasellus vitae nunc lorem. Nam feugiat vulputate mauris ac tristique. Phasellus non est finibus, facilisis erat a, tincidunt arcu. Vivamus elementum leo vel nulla vehicula dignissim.');
    })
    .then(function(author) {
      Story.createStory('Pinoccio', 'Another', 'yahaaa');
    })
}



let _conn;
const connect = function() {
  if(_conn) {
      return _conn;
  }
  _conn = db.authenticate(); // Seq syntax, which is a promise?
  return _conn;
};

const sync = function() {
  //return connect()
    //.then(function() {
      return db.sync({ force: true });
      // instead IF TABLE EXIST
    //});
}

module.exports = {
  Story,
  Author,
  sync,
  seed
};

/* models : {
  Story,
  Author
}
*/
