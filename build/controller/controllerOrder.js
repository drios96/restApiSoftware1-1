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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = __importDefault(require("../utils/global"));
/**
 * @const {Orders}
 * @desc Import Order model from data base.
 */
const pedidos = require('./../../models').Pedidos;
/**
 * @const {Purchases}
 * @desc Import Purchase model from data base.
 */
const compras = require('./../../models').compras;
/**
 * @classdesc Order controller class.
 * @desc FechaCreacion: 01/04/2020
 * @class
 * @public
 * @version 1.0.0
 * @returns {orderController} orderController
 * @author Danny Rios <dprios@espol.edu.ec>
 */
class orderController {
    /**
     * @async
     * @method
     * @public
     * @version 1.0.0
     * @author Danny Rios <dprios@espol.edu.ec>
     * @returns {JSON} JSON with the transaction response.
     * @desc This method search all the orders by user<br> Creation Date: 25/06/2020
     * @param {Request} req Object Request
     * @param {Response} res Object response
     * @type {Promise<void>} Void Promise.
     */
    getOrdersUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataId = res.locals;
            let id = dataId.post;
            pedidos.findAll({
                attributes: ['idpedido', 'idcompra', 'idproducto', 'cantidad', 'subtotal', 'cubiertos'],
                include: [
                    {
                        model: compras,
                        required: true,
                        attributes: ['entregaDomocilio', 'horaEntrega'],
                        where: {
                            idusuario: id
                        },
                    }
                ]
            }).then((data) => {
                if (data == null) {
                    res
                        .status(404)
                        .json({ log: "No hay pedidos" });
                    return;
                }
                res.status(200).json(data);
                return;
            }, (err) => {
                res.status(500).json({ log: "Error" });
                return;
            });
        });
    }
    /**
     * @async
     * @method
     * @public
     * @version 1.0.0
     * @author Danny Rios <dprios@espol.edu.ec>
     * @returns {JSON} JSON with the transaction response.
     * @desc This method will sear all the orders <br> Creation Date: 25/06/2020
     * @param {Request} req Request Object
     * @param {Response} res Response Object
     * @type {Promise<void>} Void Promise.
     */
    getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            pedidos.findAll({
                attributes: ['idpedido', 'idcompra', 'idproducto', 'cantidad', 'subtotal', 'cubiertos'],
                include: [
                    {
                        model: compras,
                        required: true,
                        attributes: ['entregaDomocilio', 'horaEntrega'],
                    }
                ]
            }).then((data) => {
                if (data == null) {
                    res
                        .status(404)
                        .json({ log: "No existe el pedido" });
                    return;
                }
                res.status(200).json(data);
                return;
            }, (err) => {
                res.status(500).json({ log: "Error" });
                return;
            });
        });
    }
    /**
   * @async
   * @method
   * @public
   * @version 1.0.0
   * @author Danny Rios <dprios@espol.edu.ec>
   * @returns {JSON} JSON with the transaction response.
   * @desc  This method will add a new order after it verify the data and it's integrity. <br> Creation Date: 01/04/2020
   * @param {Request} req Request Object
   * @param {Response} res Response Object
   * @type {Promise<void>}  Void Promise.
   */
    postData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { hash } = req.body;
            let pedido = {
                idpedido: req.body.idpedido,
                idcompra: req.body.idcompra,
                idproducto: req.body.idproducto,
                cantidad: req.body.cantidad,
                subtotal: req.body.subtotal,
                cubiertos: req.body.cubiertos
            };
            pedido.createdAt = new Date();
            pedidos.create(pedido).then((resp) => {
                if (resp._options.isNewRecord) {
                    res.status(202).json({
                        log: "Pedido ingresado con éxito",
                        uri: global_1.default.globals.urlBasePedidos + resp.dataValues.idpedido
                    });
                    return;
                }
                res.status(401).json({ log: "No se ingresaron los datos." });
                return;
            }, (err) => {
                res.status(500).json({ log: "Error" });
                return;
            });
        });
    }
    /**
    * @async
    * @method
    * @public
    * @version 1.0.0
    * @author Danny Rios <dprios@espol.edu.ec>
    * @returns {JSON} JSON with the transaction response.
    * @desc  This method is responsible for deleting a order method based on the ID that is provided by the url. <br> Creation Date: 01/04/2020
    * @param {Request} req Request Object
    * @param {Response} res Response Object
    * @type {Promise<void>} Void Promise.
    */
    deleteData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            if (isNaN(id)) {
                res.status(400).json({ log: "El ID introducido no es valido." });
                return;
            }
            id = Number(id);
            if (Number.isInteger(id) == false) {
                res.status(400).json({ log: "El ID introducido no es valido, debe ser un entero." });
                return;
            }
            pedidos.destroy({ where: { idpedido: id } }).then((data) => {
                if (data == 1) {
                    res.status(200).json({ log: "Pedido eliminado correctamente" });
                    return;
                }
                else {
                    res.status(404).json({ log: "No existe el pedido que desea eliminar." });
                    return;
                }
            }, (err) => {
                res.status(500).json({ log: "Error" });
                return;
            });
        });
    }
    /**
   * @async
   * @method
   * @public
   * @version 1.0.0
   * @author Danny Rios <dprios@espol.edu.ec>
   * @returns {JSON} JSON with the transaction response.
   * @desc  This method find a order that match with the ID in the url. The search is performed in the database. <br> Creation Date: 01/04/2020
   * @param {Request} req Request Object
   * @param {Response} res Response Object
   * @type {Promise<void>} Void Promise.
   */
    findByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            if (isNaN(id)) {
                res.status(400).json({ log: "El ID introducido no es valido." });
                return;
            }
            id = Number(id);
            if (Number.isInteger(id) == false) {
                res.status(400).json({ log: "El ID introducido no es valido, debe ser un entero." });
                return;
            }
            pedidos.findOne({
                where: {
                    idpedido: id
                },
                attributes: ['idpedido', 'idcompra', 'idproducto', 'cantidad', 'subtotal', 'cubiertos'],
                include: [
                    {
                        model: compras,
                        required: true,
                        attributes: ['idcompra', 'fechacompra', 'entregaDomocilio', 'horaEntrega']
                    }
                ]
            }).then((data) => {
                if (data == null) {
                    res.status(404).json({ log: "No Existen datos a mostrar para el ID." });
                    return;
                }
                res.status(200).json(data);
                return;
            }, (err) => {
                res.status(500).json({ log: "Error" });
                return;
            });
        });
    }
    /**
    * @async
    * @method
    * @public
    * @version 1.0.0
    * @author Danny Rios <dprios@espol.edu.ec>
    * @returns {JSON} JSON with the transaction response.
    * @desc  This method update order. <br> Creation Date: 30/07/2020
    * @param {Request} req Request Object
    * @param {Response} res Response Object
    * @type {Promise<void>} Void Promise.
    */
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            if (isNaN(id)) {
                res.status(400).json({ log: "El id del pedido no es válido." });
                return;
            }
            id = String(id);
            let pedido = {
                idpedido: req.body.idpedido,
                idcompra: req.body.idcompra,
                idproducto: req.body.idproducto,
                cantidad: req.body.cantidad,
                subtotal: req.body.subtotal,
                cubiertos: req.body.cubiertos
            };
            pedido.createdAt = new Date();
            pedidos
                .update(pedido, {
                where: {
                    cedula: id,
                },
            })
                .then((resp) => {
                if (resp[0] == 1) {
                    res.status(200).json({ log: "Pedido actualizado." });
                    return;
                }
                res.status(404).json({ log: "No se pudo actualizar." });
                return;
            }, (err) => {
                res.status(500).json({ log: "Error" });
                return;
            });
        });
    }
}
exports.default = new orderController();
