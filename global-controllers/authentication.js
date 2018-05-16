'use strict';

const CrudController = require('../controllers/crud');
const tokens = require('../helpers/tokens');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authCookie = '__service_token';

class AuthenticationController extends CrudController{
    constructor(accountService){
       super(accountService);

        this.login = this.login.bind(this);

       this.routes = {
            '/*(api|main)/*': [
                { method: 'use', cb: this.authenticate }
            ],
            '/login': [
                { method: 'post', cb: this.login }
            ]
        }
        this.registerRoutes();
    }

    async authenticate(req, res, next){
        const token = req.cookies[authCookie];
        const userToken = tokens.verifyToken(token);
        if(userToken){
            next();
        }
        else{ 
            res.redirect('/login');
        }
    }

    async login(req, res){
        const account = await this.service.readByLogin(req.body.login);
        if(!bcrypt.compareSync(req.body.password, account.password))
            throw this.service.errors.wrongCredentials;
        else{
            const token = jwt.sign({
                'login': account.login
            }, 
            'TDATAXI2018',
            {
                expiresIn: 60*60    
            });
            res.cookie(authCookie, token);
            res.sendStatus(200);
        }
    }
}

module.exports = (accountService) => {
    const controller = new AuthenticationController(
        accountService
    );
    return controller.router;
}