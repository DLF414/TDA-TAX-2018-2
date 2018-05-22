const CrudController = require("./crud");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

class CarController extends CrudController {
    constructor(CarService) {
        super(CarService);
        this.readAll = this.readAll.bind(this);

        this.routes["/"] = [{
            method: "get",
            cb: this.readAll
        }];

        this.registerRoutes();
    }

    async readAll(req, res) {
        if (!req.body.auth.payload.employee)
            throw this.service.errors.InsufficientAccountPermissions;
        res.json(await this.service.readNE());
    }

    async read(req, res) {
        if (req.body.auth.logged && req.body.auth.payload.employee)
                let car = await this.service.read(req.params.id);
                res.render('car', {
                    car: car
                });
    }

    async update(req, res) {
        switch (req.query.op) {
            case 'take':
                if (req.body.auth.payload.client)
                    throw this.service.errors.InsufficientAccountPermissions;
                await this.service.update({
                    inPark: req.body.inPark
                });
                res.status(200);
                res.end();
                break;
            case 'attach':
                if (req.body.auth.payload.client)
                    throw this.service.errors.InsufficientAccountPermissions;
                await this.service.update({
                    attachedTo: req.body.attachedTo
                });
                res.status(200);
                res.end();
                break;
            default:
                if (req.body.auth.payload.client)
                     throw this.service.errors.InsufficientAccountPermissions;
                await this.service.update({
                    model: req.body.model,
                    sign: req.body.sign,
                    inPark: req.body.inPark,
                    attachedTo: req.body.attachedTo,
                    VIN: req.body.VIN
                });
                res.status(200);
                res.end();
                break;
        }
    }
//TODO:CHECK CREATE CAR HERE
    async create(req, res) {
        if (req.body.auth.payload.client) throw this.service.errors.InsufficientAccountPermissions;
        if (!(req.body.model && req.body.sign  && req.body.VIN)) throw this.service.errors.InvalidInput;
        let check = await this.service.readNE();
         if (check.cars.includes(req.body.sign) || check.cars.includes(req.body.VIN)) throw this.service.errors.AccountAlreadyExists;
        await this.service.create(req.body, req.headers.host);
        res.status(200);
        res.end();
    }

}


module.exports = (carService) => {
    const controller = new CarController(
        carService
    );
    return controller.router;
};