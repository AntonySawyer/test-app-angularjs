const express = require('express');
const app = express();
const port = process.env.PORT || 4200;

app.use(express.static("./"));
app.get('/', function (rq, rs) {
  rs.sendFile('./index.html');
});

app.listen(port);

console.log(`Listening on port ${port}`);

const units = require('./src/data/units.json');
app.get('/unitList', function (rq, rs) {
    rs.json(units);
});
