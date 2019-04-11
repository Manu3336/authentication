const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const User = require('./models/user-model');
const router = require('express').Router();

const PORT = process.env.PORT || 5000
const app = express();

mongoose.connect(keys.mongodb.dbURI)
console.log('connected to db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());