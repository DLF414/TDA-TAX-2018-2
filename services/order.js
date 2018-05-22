const CrudService = require("./crud");

class OrderService extends CrudService {
    constructor(orders, errors) {
        super(orders, errors);
    }

    async create(order){
        await super.create(order);
    }

}


module.exports = PostService;
