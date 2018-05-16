'use strict';

const express = require('express');

module.exports = (
    accountService,
    carService,
    clientService,
    employeeService,
    orderService
) => {
    const router = express.Router();

    //defining cntrollers
    const accountController = require('./account')(
        accountService
    );
    const carController = require('./car')(
        carService
    );
    const clientController = require('./client')(
        clientService
    );
    const employeeController = require('./employee')(
        employeeService
    );
    const orderController = require('./order')(
        orderService
    );


    //defining routers    
    router.use('/accounts', accountController);
    router.use('/cars', carController);
    router.use('/clients', clientController);
    router.use('/employees', employeeController);
    router.use('/orders', orderController);

    return router;
}