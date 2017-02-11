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
      return Story.create({ title: 'The best story', content: "once upon a time"});
    })
    .then(function() {
      return Story.create({ title: 'The second best story', content: "once upon another time"});
    })
    .then(function() {
      return Author.create({name : 'Leonard'});
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
  return connect()
    .then(function() {
      return db.sync({ force: true });
      // instead IF TABLE EXIST
    });
}

module.exports = {
  Story,
  Author,
  sync,
  seed
};


