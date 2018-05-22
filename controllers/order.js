const CrudController = require("./crud");
const Moment = require('moment');

class OrderController extends CrudController {
    constructor(orderService) {
        super(orderService);
        this.registerRoutes();
    }

    async readAll(req, res) {
        switch (req.query.op) {
            case 'accepted':
                const orders = await this.service.readAccepted();

                res.render("orders", {orders: orders});
                break;
            case 'notaccepted':
                const orders = await this.service.readNotAccepted();

                res.render("orders", {orders: orders});
                break;
            default:
                const orders = await this.service.readAll();
                res.render("orders", {orders: orders});
                break;
        }
        }

    async read(req, res) {
        const order = await this.service.read(req.params.id);
        res.render("order", {properties: order, id: req.body.order_id});
    }

    async create(req, res) {
        if (!req.body.auth.client)
            throw this.service.errors.InsufficientAccountPermissions;
        if (req.body.address == null || isNaN(parseInt(req.body.client)))
            throw this.service.errors.InvalidInput;
//TODO: CHECK THIS MODEL
        await this.service.create({
            client: req.body.client,
            address: req.body.address
        });

        res.status(200);
        res.end();

    }

    async delete(req, res) {
        if (!req.body.auth.client)
            throw this.service.errors.InsufficientAccountPermissions;
        if(req.params.id == req.body.auth.payload._id) {

            await this.service.delete(req.params.id);
        }
        else
            throw this.service.errors.InsufficientAccountPermissions;
        res.status(200);
        res.end();

    }
//TODO:CHECK ВСЯКИЕ ПРИКОЛЫ С if
    async update(req, res) {
        switch (req.query.op) {
            case 'accept':
                if (req.body.auth.payload.employee) {
                    if (isNaN(parseInt(req.body.acceptedBy)))
                        throw this.service.errors.InvalidInput;
                    await this.service.update({
                        isAccepted: req.body.isAccepted,
                        acceptedBy: req.body.acceptedBy
                    });
                    res.status(200);
                    res.end();
                }
                else
                    throw this.service.errors.InsufficientAccountPermissions;
                break;
            case 'reject':
                if (req.body.auth.payload.employee) {
                    await this.service.update({
                        isAccepted: false,
                        acceptedBy: null
                    });
                    res.status(200);
                    res.end();
                }
                else
                    throw this.service.errors.InsufficientAccountPermissions;
                break;
            case 'complete':
                if (req.body.auth.payload.employee) {
                    if (isNaN(parseInt(req.body.distance)) || isNaN(parseInt(req.body.bill)))
                        throw this.service.errors.InvalidInput;
                    await this.service.update({
                        distance: req.body.distance,
                        bill: req.body.bill
                    });
                    res.status(200);
                    res.end();
                }
                else
                    throw this.service.errors.InsufficientAccountPermissions;
                break;
            default:
                if (req.body.auth.payload.client) {
                    if (req.body.address == null || isNaN(parseInt(req.body.client)))
                        throw this.service.errors.InvalidInput;
                    await this.service.update({
                        client: req.body.client,
                        address: req.body.address
                    });
                    res.status(200);
                    res.end();
                }
                else
                    throw this.service.errors.InsufficientAccountPermissions;
                break;
        }
    }

}

module.exports = (orderService) => {
    const controller = new orderController(
        orderService
    );

    return controller.router;
};