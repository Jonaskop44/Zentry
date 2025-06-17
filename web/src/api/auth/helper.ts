import { User } from "@/types/user.types";
import axios from "axios";

export class Helper {
  constructor() {}

  async login(user: User) {
    return axios
      .post("auth/login", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }
}
