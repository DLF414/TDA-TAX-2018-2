const express = require("express");
const wrap = require("../helpers/wrap");

class CrudController {
    constructor(service) {
        this.service = service;

        this.readAll = this.readAll.bind(this);
        this.read = this.read.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

        this.router = express.Router();
        this.routes = {
            "/": [
                { method: "get", cb: this.readAll },
                { method: "post", cb: this.create }
            ],
            "/:id": [
                { method: "get", cb: this.read },
                { method: "put", cb: this.update },
                { method: "delete", cb: this.delete }
            ]
        };
        this.registerRoutes();
    }

    async readAll(req, res) {
        if(!req.body.auth.payload.admin) throw this.service.errors.InsufficientAccountPermissions;
        res.json(await this.service.readChunk());
    }
    async read(req, res) {
        if(!req.body.auth.payload.admin) throw this.service.errors.InsufficientAccountPermissions;
        res.json(await this.service.read(req.params.id));
    }
    async create(req, res) {
        if(!req.body.auth.payload.admin) throw this.service.errors.InsufficientAccountPermissions;
        const properties = await this.service.update(req.body);
        res.json(properties);
    }
    async update(req, res) {
        if(!req.body.auth.payload.admin) throw this.service.errors.InsufficientAccountPermissions;
        req.body.id = req.params.id;
        const properties = await this.service.update(req.body);
        res.json(properties);
    }
    async delete(req, res) {
        if(!req.body.auth.payload.admin) throw this.service.errors.InsufficientAccountPermissions;
        const properties = await this.service.delete(req.params.id);
        res.json(properties);
    }

    registerRoutes() {
        Object.keys(this.routes).forEach(route => {
            let handlers = this.routes[route];

            if (!handlers || !Array.isArray(handlers)) {
                return;
            }

            for (let handler of handlers) {
                this.router[handler.method](route, wrap(handler.cb));
            }
        });
    }
}

module.exports = CrudController;
