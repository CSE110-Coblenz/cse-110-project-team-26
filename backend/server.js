const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello from Express!</h1>');
});

const EXPRESS_PORT = 4000;

app.listen(EXPRESS_PORT, () => {
    console.log(`Express server is running on http://localhost:${EXPRESS_PORT}`);
});