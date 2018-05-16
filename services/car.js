'use strict';

const CrudService = require('./crud');
const validator = require('../helpers/validator');

class CarService extends CrudService{
    constructor(repository, errors){
        super(repository, errors);
    }

    async create(data){
        let item;
        const validRes = validator.check('car', data);
        if(validRes.error)
            throw this.errors.validationError;
        else{
            item = await super.create(data);
        }
        return item;
    }

    async getByName(name){
        const car = this.repository.findOne({
            where:{
                name: name
            }
        });
        if(car)
            return car;
        else
            return null;
    }
}

module.exports = carService;