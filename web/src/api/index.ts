import { Auth } from "./auth";
import axios from "axios";

export default class ApiClient {
  auth: Auth;
  constructor() {
    this.auth = new Auth();

    axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;
  }
}
