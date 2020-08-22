"use strict";
exports.__esModule = true;
exports.client = void 0;
/**
 * @classdesc Index class
 * @desc Creation Data: 11/04/2020
 * @author Danny Ríos <dprios@espol.edu.ec>
 */
var express_1 = require("express");
var morgan_1 = require("morgan");
var cors_1 = require("cors");
var routerOrders_1 = require("./router/routerOrders");
var routerPayment_1 = require("./router/routerPayment");
var routerNovelty_1 = require("./router/routerNovelty");
var routerUser_1 = require("./router/routerUser");
var routerPurchase_1 = require("./router/routerPurchase");
var routerLogin_1 = require("./router/routerLogin");
var routerInvoice_1 = require("./router/routerInvoice");
var bodyParser = require("body-parser");
var path = require("path");
var helmet = require('helmet');
var expectCt = require('expect-ct');
//production redis url
var redis_url = process.env.REDIS_URL;
if (process.env.ENVIRONMENT === 'development') {
    require('dotenv').config();
    redis_url = "redis://127.0.0.1";
}
//REDIS SETUP
exports.client = require('redis').createClient(redis_url);
var Redis = require('ioredis');
var redis = new Redis(redis_url);
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1["default"]();
        this.config();
        this.router();
    }
    Server.prototype.config = function () {
        this.app.set("port", process.env.PORT || 3000);
        this.app.use(cors_1["default"]());
        this.app.use(express_1["default"].static(path.join(__dirname, '/public')));
        this.app.use(morgan_1["default"]("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
        this.app.use(helmet.permittedCrossDomainPolicies());
        this.app.use(helmet.noSniff());
        this.app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"] } }));
        this.app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
        this.app.use(expectCt({
            enforce: true,
            maxAge: 30
        }));
    };
    Server.prototype.router = function () {
        this.app.use("/api/orders", routerOrders_1["default"]);
        this.app.use("/api/payments", routerPayment_1["default"]);
        this.app.use("/api/noveltys", routerNovelty_1["default"]);
        this.app.use("/api/usersS", routerUser_1["default"]);
        this.app.use("/api/purchase", routerPurchase_1["default"]);
        this.app.use("/api/login", routerLogin_1["default"]);
        this.app.use("/api/invoice", routerInvoice_1["default"]);
    };
    Server.prototype.start = function () {
        var _this = this;
        this.app.listen(this.app.get("port"), function () {
            console.log("server on port: ", _this.app.get("port"));
        });
    };
    return Server;
}());
var server = new Server();
server.start();
