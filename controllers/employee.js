const CrudController = require("./crud");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

class EmployeeController extends CrudController {
    constructor(EmployeesService) {
        super(EmployeesService);
        this.readAll = this.readAll.bind(this);

        this.routes["/"] = [{
            method: "get",
            cb: this.readAll
        }];

        this.registerRoutes();
    }

    async readAll(req, res) {
        if (!req.body.auth.payload.admin && !req.body.auth.payload.moderator)
            throw this.service.errors.InsufficientAccountPermissions;
        res.json(await this.service.readNE());
    }

    async read(req, res) {
        switch (req.query.op) {
            case 'continue_signup':
                if (req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
                res.render('regform2', {
                    id: req.params.id
                });
                break;
            default:
                //TODO:CHECK EMPLOYEE READ HERE
                if (req.body.auth.logged)
                    if (req.params.id != req.body.auth.payload._id|| !(req.body.auth.payload.employee))
                        throw this.service.errors.InsufficientAccountPermissions;
                let employee = await this.service.read(req.params.id);
                res.render('employee', {
                    employee: employee
                });
                break;
        }

    }

    async update(req, res) {

        if (req.body.auth.logged)
            if (req.body.auth.payload._id != req.params.id) throw this.service.errors.InsufficientAccountPermissions;

        await this.service.update(req.body, req.params.id);
        res.status(200);
        res.end();
    }
//TODO:CHECK CREATE EMPLOYEE HERE
    async create(req, res) {
        if (!(req.body.auth.logged)) throw this.service.errors.InsufficientAccountPermissions;
        let check = await this.service.readNE();
        if (check.clients.includes(req.body.phone)) throw this.service.errors.AccountAlreadyExists;
        await this.service.create(req.body, req.headers.host);
        res.status(200);
        res.end();
    }

}


module.exports = (employeeService) => {
    const controller = new employeeController(
        employeeService
    );
    return controller.router;
};