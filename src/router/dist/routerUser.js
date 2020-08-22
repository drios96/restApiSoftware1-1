"use strict";
exports.__esModule = true;
var express_1 = require("express");
var controllerUser_1 = require("../controller/controllerUser");
var security_1 = require("../utils/security");
/**
 * @classdesc User router class.
 * @desc Creation Date: 04/11/2020
 * @class
 * @public
 * @version 1.0.0
 * @returns {routerUser} router
 * @author Karla B. Burgos Gayrey <kbburgos@espol.edu.ec>
 */
var routerUser = /** @class */ (function () {
    function routerUser() {
        this.router = express_1.Router();
        this.config();
    }
    routerUser.prototype.config = function () {
        //this.router.[get | post | put | delete]
        //this.router.get("/", Seguridad.verificarToken, userController.findAll);
        this.router.get("/:id", security_1.Security.checkToken, security_1.Security.cacheId, controllerUser_1["default"].findByID);
        this.router.get("/", security_1.Security.checkToken, controllerUser_1["default"].getUsers);
        this.router.post("/create", controllerUser_1["default"].addUser);
        this.router["delete"]("/:id", security_1.Security.checkToken, controllerUser_1["default"].deleteUser);
        this.router.put("/update/:id", security_1.Security.checkToken, controllerUser_1["default"].updateUsuario);
    };
    return routerUser;
}());
var appRoutes = new routerUser();
exports["default"] = appRoutes.router;
