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
    accountService,
    carService,
    clientService,
    employeeService,
    orderService
    );

    //Mounting
    app.use(cookieParser());
    app.use(bodyParse.json());


    app.use('/styles', express.static(__dirname + '/styles'));
    app.use('/scripts', express.static(__dirname + '/scripts'));
    app.use('/img', express.static(__dirname + '/img'));
    app.use('/bootstrap', express.static(__dirname + '/bootstrap'));
    app.set('views', './views');
    app.set('view engine', 'pug');

    app.use((req, res, next) => {
        let auth = {};
        if (req.cookies['_token']) {
            try {
                auth['payload'] = jwt.verify(req.cookies['_token'], config.jwt.secret);
                auth['logged'] = true;
            } catch (error) {
                auth['logged'] = false;
            }
        } else {
            auth['logged'] = false;
        }
        req.body['auth'] = auth;
        next();
    });


    app.use('/api/v1', apiController);
    //app.use('/', error);
    app.use((error, req, res, next) => {
        if(!isNaN(parseInt(error.status))) res.status(parseInt(error.status));
        else res.status(500);
        res.json(error);
    });
    app.get('*', (req, res)=>{
        res.render('error',{Code:404, Text:'Not Found'});
    })
    return app;
};