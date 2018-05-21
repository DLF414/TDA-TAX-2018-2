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
                //TODO: FIX EMPLOYEE READ HERE
                let user = await this.service.read(req.params.id);
                if (req.body.auth.logged)
                    if (req.params.id == req.body.auth.payload._id) {
                        emails_in = await this.emails.readAllByFlag('in', req.params.id, {
                            page: req.query.inpage ? req.query.inpage : undefined,
                            limit: 10
                        });
                        emails_out = await this.emails.readAllByFlag('out', req.params.id, {
                            page: req.query.outpage ? req.query.outpage : undefined,
                            limit: 10
                        });
                    }
                res.render('user', {
                    user: user,
                    auth: req.body.auth,
                    emails: { in: emails_in,
                        out: emails_out
                    }
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
//TODO:FIX CREATE EMPLOYEE HERE
    async create(req, res) {
        if (req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
        if (!(req.body.signup_username && req.body.signup_email && req.body.signup_password && req.body.signup_confirm)) throw this.service.errors.InvalidInput;
        let check = await this.service.readNE();
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = re.test(req.body.signup_email);
        if (!result || req.body.signup_password.length < 8 || req.body.signup_password != req.body.signup_confirm) throw this.service.errors.InvalidInput;
        if (check.users.includes(req.body.signup_username) || check.emails.includes(req.body.signup_emails)) throw this.service.errors.AccountAlreadyExists;
        if (check.in_users.includes(req.body.signup_username) || check.in_emails.includes(req.body.signup_emails)) throw this.service.errors.AccountBeingCreated;
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