"use strict";
/*
  Fcreación: -----
  Fmodificación: 1/04/2020
  Ucreación: ------
  Umodificación: Danny
  Comentarios: se importó el archivo router pedidos para hacer uso de las rutas al momento de levantar el server
  */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require('helmet');
const cors_1 = __importDefault(require("cors"));
const routerPedidos_1 = __importDefault(require("./router/routerPedidos"));
const routerPago_1 = __importDefault(require("./router/routerPago"));
const routerUsuario_1 = __importDefault(require("./router/routerUsuario"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.router();
    }
    config() {
        this.app.set("port", process.env.PORT || 3000);
        this.app.use(cors_1.default());
        //static files
        this.app.use(express_1.default.static(path.join(__dirname, '/public')));
        this.app.use(morgan_1.default("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
        this.app.use(helmet.permittedCrossDomainPolicies());
        this.app.use(helmet.noSniff());
        this.app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"] } }));
    }
    router() {
        this.app.use("/api/pedidos", routerPedidos_1.default);
        this.app.use("/api/pagos", routerPago_1.default);
        this.app.use("/api/usuarios", routerUsuario_1.default);
    }
    start() {
        this.app.listen(this.app.get("port"), () => {
            console.log("server on port: ", this.app.get("port"));
            //db.sequelize.sync();
        });
    }
}
const server = new Server();
server.start();
