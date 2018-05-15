const Joi = require('joi');

const schemas = {
    'account': Joi.object().keys({
        login: Joi.string(),
        password: Joi.string(),
        created: ,
        role: Joi.string(),
        isBlocked: Joi.boolean() ,
    }),
    'car': Joi.object().keys({
        model: Joi.string(),
        sign: Joi.string(),
        VIN: Joi.string(),
        attachedTo: Joi.number().integer(),
        inPark: Joi.boolean()
    }),
    'client': Joi.object().keys({
        name: Joi.string() ,
        address: Joi.string(),
        phone: Joi.string()
    }),
    'employee': Joi.object().keys({
        name: Joi.string() ,
        address: Joi.string(),
        phone: Joi.string(),
        role: Joi.string(),
        salary: Joi.number().integer(),
        online: Joi.boolean()

    }),
    'order': Joi.object().keys({
        client: Joi.number().integer(),
        date: ,
        address: Joi.string(),
        isAccepted: Joi.boolean(),
        acceptedBy: Joi.boolean(),
        distance: Joi.number().integer(),
        bill: Joi.number().integer()
    })
}

exports.check = function (schema, body) {
    if(!schemas[schema])
        return {};
    return Joi.validate(body, schemas[schema], {presence: 'required'});
}