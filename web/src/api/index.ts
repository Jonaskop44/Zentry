import { Activity } from "./activity";
import { Admin } from "./admin";
import { Auth } from "./auth";

export default class ApiClient {
  auth: Auth;
  admin: Admin;
  activity: Activity;
  constructor() {
    this.auth = new Auth();
    this.admin = new Admin();
    this.activity = new Activity();
  }
}
