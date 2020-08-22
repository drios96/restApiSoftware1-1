"use strict";
exports.__esModule = true;
exports.Security = void 0;
var crypto = require('crypto');
var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");
var index_1 = require("../index");
var global_1 = require("./global");
/**
 * @classdesc Container class of api security functions.
 * @desc Creation Date: 04/13/2020
 * @class
 * @public
 * @version 1.0.0
 * @author Jonathan Quintana <jiquinta@espol.edu.ec>
 */
var Security = /** @class */ (function () {
    function Security() {
    }
    /**
     * @static
     * @method
     * @public
     * @version 1.0.0
     * @author Jonathan Quintana <jiquinta@espol.edu.ec>
     * @returns {String} Hash sha256 of the entered JSON.
     * @desc This method is in charge of generating the sha256 hash of the JSON that is entered as an argument, proceeds to loop through it and store it as a string to later generate the respective hash. <br> Creation Date: 04/13/2020
     * @param {Any} json JSON to calculate the hash.
     */
    Security.hashJSON = function (json) {
        var data = "";
        for (var pass in json) {
            if (json.hasOwnProperty(pass)) {
                data += pass + ":" + json[pass] + ",";
            }
        }
        return crypto.createHash('sha256').update(data).digest('hex');
    };
    /**
     * @static
     * @method
     * @public
     * @version 1.0.0
     * @author Jonathan Quintana <jiquinta@espol.edu.ec>
     * @returns {String} Encrypted string.
     * @desc It generates an AES encryption of the entered string for its later return and additional processing, we proceed to replace the incompatible characters to be sent in the URL. <br> Creation Date: 04/13/2020
     * @param {String} cadena string to encrypt.
     */
    Security.encrypt = function (cadena) {
        var pass = global_1["default"].globals.secretEncryp;
        //.toString().replace(/\//gi, "-")
        return AES.encrypt(cadena, pass).toString();
    };
    /**
     * @static
     * @method
     * @public
     * @version 1.0.0
     * @author Jonathan Quintana <jiquinta@espol.edu.ec>
     * @returns {String} Decrypted string.
     * @desc Decrypts the string that is entered as an argument to transform it into plain text after its processing and regression to the normal AES because the string enters replaced with some characters. <br> Creation Date: 04/13/2020
     * @param {String} cadena string to decrypt.
     */
    Security.decrypt = function (cadena) {
        var pass = global_1["default"].globals.secretEncryp;
        var subString = cadena.replace(/-/gi, "/");
        var bytes = AES.decrypt(subString, pass);
        return bytes.toString(CryptoJS.enc.Utf8);
    };
    /**
     * @static
     * @method
     * @public
     * @version 1.0.0
     * @author Jonathan Quintana <jiquinta@espol.edu.ec>
     * @desc middleware function to verify the validity of the sent session token.
     */
    Security.checkToken = function (req, res, next) {
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            var bearerToken = bearer[1];
            jwt.verify(bearerToken, global_1["default"].globals.secretToken, function (err, data) {
                if (err) {
                    res.status(401).json({ error: 'El token no es válido' });
                }
                else {
                    var dataId = data['id'];
                    res.locals.post = dataId;
                    next();
                    return;
                }
            });
        }
        else {
            res.status(403).json({ log: "No existe el token de sesión." });
        }
    };
    /**
     * @static
     * @method
     * @public
     * @version 1.0.0
     * @author Danny Ríos <dprios@espol.edu.ec>
     * @desc funtion to convert password to 256-bit (32-byte) hash value.
     * @param {String} password string to generate the sha256.
     */
    Security.hashPassword = function (password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    };
    Security.cacheId = function (req, res, next) {
        var id = req.params.id;
        index_1.client.get(id, function (err, data) {
            if (err)
                throw err;
            if (data !== null) {
                res.status(200).json(data);
            }
            else {
                next();
            }
        });
    };
    return Security;
}());
exports.Security = Security;
