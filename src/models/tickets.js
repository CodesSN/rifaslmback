const { Schema, model } = require('mongoose');
const mongodb = require('mongodb');
const { boolean } = require('webidl-conversions');

var mongoPassword = 'node1872';
const mongoose = require('mongoose');
var config = JSON.parse(process.env.APP_CONFIG);
// colocamos la url de conexión local y el nombre de la base de datos
mongoose.connect("mongodb://" + config.mongo.user + ":" + encodeURIComponent(mongoPassword) + "@" + 
config.mongo.hostString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); // enlaza el track de error a la consola (proceso actual)
db.once('open', () => {
  console.log('connected'); // si esta todo ok, imprime esto
});

const TicketSchema = new Schema({
    id: Number,
    reserved:  Boolean,
    confirmed: Boolean,
});

module.exports = model('Ticket', TicketSchema);














































