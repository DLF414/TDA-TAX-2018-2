'use strict'

const CrudController = require('../controllers/crud');

class RegistrationController extends CrudController {
    constructor(AccountService) {
        super(AccountService);

        this.registration = this.registration.bind(this);

        this.routes = {
            '/registration': [ 
                { method: 'post', cb: this.registration }
            ]
        }
        this.registerRoutes();
    }

    async registration(req, res) {
        let isCreated = await this.service.checkCredentials(req.body);
        let user;
        if(isCreated){
            user = await this.service.create(req.body);
        }
        res.json(user);
    }
}

module.exports = (AccountService) => {
    const controller = new RegistrationController(
        AccountService
    );
    return controller.router;
}