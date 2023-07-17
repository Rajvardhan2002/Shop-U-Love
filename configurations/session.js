const mongodbStore = require("connect-mongodb-session");
const expressSession = require("express-session");

function createSessionStore() {
  const MongoDBStore = mongodbStore(expressSession);
  const sessionStore = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "online-shop",
    collection: "sessions",
  });
  return sessionStore;
}

function createSessionConfig() {
  //here we will simply return an object that will pass inside app.use(expressSession(our-returned-object))
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000,//3 days
    },
  };
}

module.exports = createSessionConfig;
