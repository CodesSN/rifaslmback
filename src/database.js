var mongoPassword = 'node1872';

var config = JSON.parse(process.env.APP_CONFIG);
  var MongoClient = require('mongodb').MongoClient;

  const client = new MongoClient("mongodb://" + config.mongo.user + ":" + encodeURIComponent(mongoPassword) + "@" + 
  config.mongo.hostString, {
    useUnifiedTopology: true
  });

  client.connect( 
    function(err, db) {
      if(!err) {
        console.log("We are connected");
      } else {
        console.log("Error connecting to MongoDB");
        console.log(err);
      }
    }
  );

  module.exports = async () => { client.db(deaceb7d047af37601f0b3b4d0a7c28d) };