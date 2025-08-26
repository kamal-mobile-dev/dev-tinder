const express = require('express');
const app = express(); // creating instance app js application

app.use('/test', (req, res) => {
  res.send('Hello from the server');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});
