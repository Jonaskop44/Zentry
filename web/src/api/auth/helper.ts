import { User } from "@/types/user.types";
import api from "../axios";

export class Helper {
  constructor() {}

  async login(user: User) {
    return api
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

  async register(user: User) {
    return api
      .post("auth/register", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async refreshToken() {
    return api
      .post("auth/refresh")
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
