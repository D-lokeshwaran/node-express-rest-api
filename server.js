require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const mongoose = require('mongoose');

const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');

const PORT = process.env.PORT || 3600;

// Connect to mongoDB
connectDB()

app.use(logger)

// on fetch allow credentials true
app.use(credentials);
app.use(cors(corsOptions));

//handle form data middle ware
app.use(express.urlencoded({ extended: false })); // later see in documentation
// build in middle ware
app.use(express.json());

// middleware for cookies;
app.use(cookieParser());

// to server static files like images and style sheets...
app.use(express.static(path.join(__dirname, '/public')))

app.use('^/', require('./routes/route'));
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'))

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' })
    } else {
        res.type('txt').send("404 Not Found")
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('connected to mongo db');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
