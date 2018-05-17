'use strict'

const CrudController = require('./crud');
const { checkAuth } = require('./../global-controllers/authorisation');

class AccountController extends CrudController{
    constructor(accountController){
        super(accountService);

        this.routes = {
            '/': [
                { method: 'get', cb: this.readAll },
            ],
            '/:login': [
                { method: 'get', cb: this.readlogin },
                { method: 'put', cb: this.updatelogin },
                { method: 'delete', cb: this.deletelogin }
            ],
            '/:id': [
                { method: 'get', cb: this.readid },
                { method: 'put', cb: this.updateid },
                { method: 'delete', cb: this.deleteid }
            ]
        };

        this.registerRoutes();
    }

    async readlogin(req, res){
        let data = await this.service.readByLogin(req.params.login);
        res.json(data);
    }

    async deletelogin(req, res){
        const user = await this.service.readByLogin(req.params.login);
        const checkValue = await checkAuth(req.ability, 'delete', user);
        if(checkValue.access){
            await this.service.delete(user.id);
        }
        else{
            throw checkValue.error;
        }
        res.sendStatus(200);
    }

    async updatelogin(req, res){
        const user = await this.service.readByLogin(req.params.login);
        const checkValue = await checkAuth(req.ability, 'update', user);
        if(checkValue.access){
            await this.service.update(user.id, req.body);
        }
        else{
            throw checkValue.error;
        }
        res.sendStatus(200);
    }

    async readid(req, res) {
        let data = await this.service.read(req.params.id);
        res.json(data);
    }

    async updateid(req, res) {
        let data = await this.service.update(req.params.id, req.body);
        res.json(data);
    }

    async deleteid(req, res) {
        let data =  await this.service.delete(req.params.id);
        res.json(data);
    }
}

module.exports = (accountService) => {
    const controller = new AccountController(
        accountService
    );
    return controller.router;
};