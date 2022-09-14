const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server has started running on port ${port}....`);
});