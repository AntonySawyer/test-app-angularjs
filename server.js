const express = require('express');
const app = express();
const port = process.env.PORT || 4200;

app.use(express.static("./"));
app.get('/', function (req, res) {
  res.sendFile('./index.html');
});

app.listen(port);

console.log(`Listening on port ${port}`);