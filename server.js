const express = require('express');
const app = express();
const env = process.env.NODE_ENV || "production";
const config = require('./config')[env];
const port = process.env.PORT || config.port;

require('./app/routes/cost.js')(app);
app.listen(port);
console.log("App listening on port " + port);