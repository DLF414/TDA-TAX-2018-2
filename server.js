'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParse = require('body-parser');
const errors = require('./helpers/error');

//services
const accountService = require('./services/account');
const carService = require('./services/car');
const clientService = require('./services/client');
const employeeService = require('./services/employee');
const orderService = require('./services/order');

module.exports = (db, config) => {
    const app = express();
    //services
    const accountService = new accountService(
        db.account,
        errors
    );
    const carService = new carService(
        db.car,
        errors
    );
    const clientService = new clientService(
        db.client,
        errors
    );
    const employeeService = new employeeService(
        db.employee,
        errors
    );
    const orderService = new orderService(
        db.order,
        errors
    );
    //controllers
    const error = require('./global-controllers/error');
    const registration = require('./global-controllers/registration')(
        accountService
    );
    const authController = require('./global-controllers/authentication')(
        accountService
    );
    const authorisationController = require('./global-controllers/authorisation');
    const apiController = require('./controllers/api')(
    accountService
    carService
    clientService
    employeeService
    orderService
    );

    //Mounting
    app.use(cookieParser());
    app.use(bodyParse.json());

    app.use('/', authController);
    app.use('/', registration);
    app.use('/api/', authorisationController.ability());

    app.use(express.static(__dirname + '/public/images'));
    app.use(express.static(__dirname + '/public/styles'));
    app.use(express.static(__dirname + '/public/scripts'));

    app.get('/main/im', (req, res) => {        
        res.sendFile(__dirname + '/public/pages/im.html');
    });

    app.get('/login', (req, res) => {
        res.sendFile(__dirname + '/public/pages/login-page.html');
    });
    
    app.get('/registration', (req, res) => {
        res.sendFile(__dirname + '/public/pages/registration-page.html');
    });

    app.use('/api/v1', apiController);
    //app.use('/', error);

    return app;
};