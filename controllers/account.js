'use strict'

const CrudController = require('./crud');
const { checkAuth } = require('./../global-controllers/authorisation');

class AccountController extends CrudController{
    constructor(accountController){
        super(accountService);

        this.routes = {
            '/': [
                { method: 'get', cb: this.readAll },
            ]
        };

        this.registerRoutes();
    }


    async readAll(req, res) {
        switch (req.query.op) {
            case 'logout':
                if (!req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
                res.cookie('_token', '', {
                    maxAge: 0
                });
                res.redirect(req.headers.referer);
                break;
            case 'signup':
                if (req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
                res.render('regform');
                break;
            case 'signin':
                if (req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
                let user_info, block;
                if(!req.query.login || !req.query.password) throw this.service.errors.MissingRequiredQueryParameter;
                user_info = await this.service.signinUser(req.query.login, req.query.password);
                if (!user_info) throw this.service.errors.AuthenticationFailed;
                let token = jwt.sign({
                        _id: user_info.id,
                        admin: user_info.is_admin,
                        moderator: user_info.is_moderator
                    },
                    config.jwt.secret, {
                        expiresIn: 86400
                    });
                res.cookie('_token', token, {
                    maxAge: 86400000
                })
                res.redirect(req.headers.referer);
                break;
            default:
                if (!req.body.auth.payload.admin && !req.body.auth.payload.moderator)
                    throw this.service.errors.InsufficientAccountPermissions;
                res.json(await this.service.readNE());
                break;
        }

    }

    async read(req, res) {
        switch (req.query.op) {
            case 'confirm':
                if (req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
                if (await this.service.isActual(req.query.verify)) {
                    await this.service.confirm(req.params.id, req.query.verify);
                    res.redirect(`/user/${req.params.id}?op=continue_signup`);
                } else {
                    await this.service.delete(req.params.id);
                    throw this.service.errors.InvalidQueryParameterValue;
                }
                break;
            case 'continue_signup':
                if (req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
                res.render('regform2', {
                    id: req.params.id
                });
                break;
            case 'message':
                if (req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
                res.render('confirm');
                break;
            default:
                let account = await this.service.read(req.params.id);

                res.render('user', {
                    user: account,
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

    async create(req, res) {
        if (req.body.auth.logged) throw this.service.errors.InsufficientAccountPermissions;
        if (!(req.body.signup_login && req.body.signup_password)) throw this.service.errors.InvalidInput;
        let check = await this.service.readNE();
        if (req.body.signup_password.length < 8) throw this.service.errors.InvalidInput;
        if (check.users.includes(req.body.signup_login) ) throw this.service.errors.AccountAlreadyExists;
        await this.service.create(req.body, req.headers.host);
        res.status(200);
        res.end();
    }

}

module.exports = (accountService) => {
    const controller = new AccountController(
        accountService
    );
    return controller.router;
};