//TODO: ORDER, tut mnogo
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
        if(req.body.address == null || isNaN(parseInt(req.body.client)))
            throw this.service.errors.InvalidInput;
//TODO: CHECK THIS MODEL
        await this.service.create({
            client:req.body.client,
            address:req.body.address
        });

        res.status(200);
        res.end();

    }
//TODO: ВСЯКИЕ ПРИКОЛЫ С case
    async update(req, res){
        if(!req.body.auth.logged )//&& !ISCLIENT
            throw this.service.errors.InsufficientAccountPermissions;

        if(req.body.address == null || isNaN(parseInt(req.body.client)) || isNaN(parseInt(req.body.acceptedBy))||isNaN(parseInt(req.body.distance))||isNaN(parseInt(req.body.bill)))
            throw this.service.errors.InvalidInput;
//TODO: CHECK MODEL RABOTOSPOSOBNOST
        await this.service.update({
            client:req.body.client,
            address:req.body.address,
            isAccepted:req.body.isAccepted,
            acceptedBy:req.body.acceptedBy,
            distance:req.body.distance,
            bill:req.body.bill
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