const Sequelize = require('Sequelize');
var db = new Sequelize(process.env.DATABASE_URL);

// model singular
const Story = db.define('story', {
      title: {
          type: Sequelize.STRING
      },
      content: {
          type: Sequelize.TEXT
      }
    },
    {
      classMethods: {
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
      Story.createStory('Leonard', 'Title', 'yohoooo');
    })
    .then(function(author) {
      Story.createStory('Evan', 'Another', 'yahaaa');
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


