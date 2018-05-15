'use strict'

const CrudService = require('./crud');
const bcrypt = require('bcrypt');
const validator = require('../helpers/validator');
const tokens = require('../helpers/tokens');

class ClientService extends CrudService{
    constructor(repository, errors){
        super(repository, errors);
    }

    async update(id, data){
        if(data.password)
            data.password = bcrypt.hashSync(data.password, 8);
        return await super.update(id, data);
    }

    async checkCredentials(data){
        let users = await this.repository.findAll({
            where: {login: data.login}
        });
        if(users.length !== 0)
            throw this.errors.loginExist;
        else
            return true;
    }

    async create(data){
        data.password = bcrypt.hashSync(data.password, 8);
        const validRes = validator.check('client', data);

        if(validRes.error)
            throw this.errors.validationError;
        else
            return await super.create(data);
    }

    async readByLogin(login){
        const client =  await this.repository.findOne({
            where: {
                login: login
            }
        });
        if(client)
            return client;
        else
            throw this.errors.notFound;
    }
}

module.exports = ClientService;