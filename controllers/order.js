const CrudController = require("./crud");
const Moment = require('moment');

class OrderController extends CrudController {
    constructor(orderService) {
        super(orderService);
        this.registerRoutes();
    }

    async read(req, res) {
        let properties = {};
        let ind = 0;
//TODO: CASE APPLY|NOT APLY
        const status_id = await this.status.getIdbyName("APPROVED");
        const thread = await this.service.read(req.params.id, status_id, {limit:10, page:(req.query.page?req.query.page:undefined)});

        let utc = Moment.utc(thread.user.created);
        thread.user.created = Moment(utc).toDate().toUTCString();

        for (let iterator of thread.pusers) {
            utc = Moment.utc(iterator.created);
            iterator.created = Moment(utc).toDate().toUTCString();
        }
//TODO:order render
        res.render("thread", { properties: thread, auth:req.body.auth });
    }

    async create(req, res){
        if(!req.body.auth.logged )//&& !ISCLIENT
            throw this.service.errors.InsufficientAccountPermissions;
//TODO:INVALID ORDER DATA
        if(req.body.category == null || isNaN(parseInt(req.body.category)))
            throw this.service.errors.InvalidUri;

        if(!req.body.subject || !req.body.content)
            throw this.service.errors.InvalidInput;
//TODO: ORDER MODEL
        await this.service.create({
            subject:req.body.subject,
            content:req.body.content,
            category:req.body.category,
            user_account_id:req.body.auth.payload._id,
            status:status_id
        });

        res.status(200);
        res.end();

    }
//TODO: ВСЯКИЕ ПРИКОЛЫ С case
    async update(req, res){
        if(!req.body.auth.logged )//&& !ISCLIENT
            throw this.service.errors.InsufficientAccountPermissions;
//TODO:INVALID ORDER DATA
        if(req.body.category == null || isNaN(parseInt(req.body.category)))
            throw this.service.errors.InvalidUri;

        if(!req.body.subject || !req.body.content)
            throw this.service.errors.InvalidInput;
//TODO: ORDER MODEL
        await this.service.update({
            subject:req.body.subject,
            content:req.body.content,
            category:req.body.category,
            user_account_id:req.body.auth.payload._id,
            status:status_id
        });

        res.status(200);
        res.end();

    }
}

module.exports = (orderService) => {
    const controller = new orderController(
        orderService
    );

    return controller.router;
};