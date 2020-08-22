"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var global_1 = require("../utils/global");
var rols = require("./../../models").rols;
var security_1 = require("../utils/security");
var index_1 = require("../index");
/**
 * @const User
 * @desc Import User model from data base.
 */
var user = require("./../../models").Usuarios;
/**
 * @classdesc User controller class.
 * @desc Creation Date: 12/04/2020
 * @class
 * @public
 * @version 1.0.0
 * @returns {userController} userController
 * @author Karla Burgos <kbburgos@espol.edu.ec>
 */
var userController = /** @class */ (function () {
    function userController() {
    }
    /**
    * @async
    * @method
    * @public
    * @version 1.0.0
    * @author Danny Rios <dprios@espol.edu.ec>
    * @returns {JSON} JSON with the transaction response.
    * @desc This methodget all users <br> Creation Date: 05/08/2020
    * @param {Request} req Request Object
    * @param {Response} res Response Object
    * @type {Promise<void>} Void Promise.
    */
    userController.prototype.getUsers = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                user.findAll({
                    attributes: ["cedula", "nombre", "apellido", "telefono", "email", "direccion", "rol"]
                }).then(function (data) {
                    if (data == null) {
                        res
                            .status(404)
                            .json({ log: "No hay usuarios" });
                        return;
                    }
                    for (var i = 0; i < data.length; i++) {
                        data[i].telefono = security_1.Security.decrypt(data[i].telefono);
                        data[i].direccion = security_1.Security.decrypt(data[i].direccion);
                    }
                    res.status(200).json(data);
                    return;
                }, function (err) {
                    res.status(500).json({ log: "Error" });
                    return;
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * @async
     * @method
     * @public
     * @version 1.0.1
     * @author Karla Burgos <kbburgos@espol.edu.ec>
     * @returns {JSON} JSON with the transaction response.
     * @desc  This method add a user to the system. <br> Creation Date: 19/04/2020
     * @param {Request} req Request Object
     * @param {Response} res Response Object
     * @type {Promise<void>} Void Promise.
     */
    userController.prototype.addUser = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                data = {
                    cedula: req.body.cedula,
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    contrasenia: req.body.contrasenia,
                    rol: req.body.rol,
                    direccion: req.body.direccion
                };
                data.createdAt = new Date();
                data.telefono = security_1.Security.encrypt(data.telefono);
                ;
                data.direccion = security_1.Security.encrypt(data.direccion);
                ;
                data.contrasenia = security_1.Security.hashPassword(data.contrasenia);
                user.create(data).then(function (resp) {
                    if (resp._options.isNewRecord) {
                        res
                            .status(202)
                            .json({
                            log: "Ingresado",
                            uri: global_1["default"].globals.urlUserBase + data.cedula
                        });
                        return;
                    }
                    res.status(400).json({ log: "Sintaxis incorrecta para crear el usuario." });
                    return;
                }, function (err) {
                    if (err.errors) {
                        if (err.errors[0]) {
                            if (err.errors[0].message == "PRIMARY must be unique") {
                                res.status(500).json({ log: "Usuario ya existe." });
                                return;
                            }
                        }
                    }
                    res.status(500).json({ log: "Error del servidor, intente nuevamente." });
                    return;
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * @async
     * @method
     * @public
     * @version 1.0.1
     * @author Karla Burgos <kbburgos@espol.edu.ec>
     * @returns {JSON} JSON with the consult data.
     * @desc This method is responsible for searching the user based on the ID provided in the url. <br> Creation Date: 12/04/2020
     * @param {Request} req Request Object
     * @param {Response} res Response Object
     * @type {Promise<void>} Void Ptromise.
     */
    userController.prototype.findByID = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var id;
            return __generator(this, function (_a) {
                id = req.params.id;
                if (isNaN(id)) {
                    res.status(400).json({ log: "La cédula introducida no es valido." });
                    return [2 /*return*/];
                }
                id = Number(id);
                if (Number.isInteger(id) == false) {
                    res
                        .status(400)
                        .json({ log: "El ID introducido no es valido, debe ser un entero." });
                    return [2 /*return*/];
                }
                user
                    .findOne({
                    where: {
                        cedula: id
                    },
                    attributes: ["cedula", "nombre", "apellido", "telefono", "email", "direccion", "rol"]
                })
                    .then(function (data) {
                    if (data == null) {
                        res
                            .status(404)
                            .json({ log: "No Existen datos a mostrar para el ID." });
                        return;
                    }
                    data.telefono = security_1.Security.decrypt(data.telefono);
                    data.direccion = security_1.Security.decrypt(data.direccion);
                    res.status(200).json(data);
                    // ENVIANDO A REDIS
                    //client.set(id,3600,data);  
                    index_1.client.set(id, JSON.stringify(data), function (error, result) {
                        if (error) {
                            res.status(500).json({ error: error });
                        }
                    });
                    return;
                }, function (err) {
                    res.status(500).json({ log: "Error" });
                    return;
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * @async
     * @method
     * @public
     * @version 1.0.0
     * @author Karla Burgos <kbburgos@espol.edu.ec>
     * @returns {JSON} JSON with the transaction response.
     * @desc  This method removes the user from the base to the ID which is provided by the url. <br> Creation Date: 12/04/2020
     * @param {Request} req Request Object
     * @param {Response} res Response Object
     * @type {Promise<void>} Void Promise.
     */
    userController.prototype.deleteUser = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var id;
            return __generator(this, function (_a) {
                id = req.params.id;
                if (isNaN(id)) {
                    res.status(400).json({ log: "El ID introducido no es valido." });
                    return [2 /*return*/];
                }
                id = Number(id);
                if (Number.isInteger(id) == false) {
                    res
                        .status(400)
                        .json({ log: "El ID introducido no es valido, debe ser un entero." });
                    return [2 /*return*/];
                }
                user.destroy({ where: { cedula: id } }).then(function (data) {
                    if (data == 1) {
                        res.status(200).json({ log: "Usuario eliminado" });
                        return;
                    }
                    else {
                        res.status(404).json({ log: "Sin datos a eliminar." });
                        return;
                    }
                }, function (err) {
                    res.status(500).json({ log: "Error" });
                    return;
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * @async
     * @method
     * @public
     * @version 1.0.1
     * @author Karla Burgos <kbburgos@espol.edu.ec>
     * @returns {JSON} JSON with the transaction response.
     * @desc  This method modifies the user's information in the database, all the data is updated. <br> Creation Date: 19/04/2020
     * @param {Request} req Request Object
     * @param {Response} res Response Object
     * @type {Promise<void>} Void Promise.
     */
    userController.prototype.updateUsuario = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var id, data;
            return __generator(this, function (_a) {
                id = req.params.id;
                if (isNaN(id)) {
                    res.status(400).json({ log: "La cédula ingresada no es valida." });
                    return [2 /*return*/];
                }
                id = String(id);
                data = {
                    cedula: req.body.cedula,
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    direccion: req.body.direccion,
                    contrasenia: req.body.contrasenia,
                    rol: req.body.rol,
                    updatedAt: new Date()
                };
                data.telefono = security_1.Security.encrypt(data.telefono);
                ;
                data.direccion = security_1.Security.encrypt(data.direccion);
                ;
                data.contrasenia = security_1.Security.hashPassword(data.contrasenia);
                user
                    .update(data, {
                    where: {
                        cedula: id
                    }
                })
                    .then(function (resp) {
                    if (resp[0] == 1) {
                        res.status(200).json({ log: "Usuario actualizado." });
                        return;
                    }
                    res.status(404).json({ log: "No se pudo actualizar." });
                    return;
                }, function (err) {
                    res.status(500).json({ log: "Error" });
                    return;
                });
                return [2 /*return*/];
            });
        });
    };
    return userController;
}());
exports["default"] = new userController();
