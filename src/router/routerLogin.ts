import { Router } from "express";
import comprasLogin from "../controller/controllerLogin";
import { Security } from "../utils/security";

/**
* @classdesc Login router class.
* @desc Creation Date: 04/19/2020
* @class
* @public
* @version 1.0.0
* @returns {routerLogin} router
* @author Jonathan Quintana <jiquinta@espol.edu.ec>
*/
class routerLogin {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    //this.router.[post]
    this.router.post("/usuario",Security.cacheLogin, comprasLogin.login);
    this.router.post("/token", comprasLogin.generateToken);
    this.router.post("/reject", comprasLogin.rejectToken);
  }
}
export default new routerLogin().router