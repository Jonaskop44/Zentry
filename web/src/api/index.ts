import { Admin } from "./admin";
import { Auth } from "./auth";

export default class ApiClient {
  auth: Auth;
  admin: Admin;
  constructor() {
    this.auth = new Auth();
    this.admin = new Admin();
  }
}
