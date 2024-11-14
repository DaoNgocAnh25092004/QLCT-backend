const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

dotenv.config();

// Use cookie parser
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

// Use port from file .env
const port = process.env.PORT || 3001;

app.use(express.json({ limit: '10mb' }));
// // Import route
const route = require('./routes');

// // Import db
const db = require('./configs/db');

// Connect to db
db.connect();

// XMLHttpRequest, fetch, axios, ajax... to javascript from server

app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json());

// // Route init
route(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
