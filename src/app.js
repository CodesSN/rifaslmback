const express = require('express');
const app = express();
const cors = require('cors');
const port =  process.env.PORT

require('./database');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    app.use(cors());
    next();
});

app.get('/', (req, res) => {
    console.log("nice");
    res.send('bienvenido a rifaslm');
});

app.use('/',require('./routes/index'));

app.listen(port, () => {
  console.log('Server started on port ' + port);
});