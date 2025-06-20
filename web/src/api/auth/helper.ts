import api from "../axios";
import { useUserStore } from "@/data/user-store";
import { LoginFormData, RegisterFormData } from "@/lib/auth-validation";

export class Helper {
  private userStore = useUserStore.getState();
  constructor() {}

  async login(user: LoginFormData) {
    return api
      .post("auth/login", {
        username: user.username,
        password: user.password,
        rememberMe: user.rememberMe,
      })
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        this.userStore.setUser(data);
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async register(user: RegisterFormData) {
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

  async logout() {
    return api
      .post("auth/logout")
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        this.userStore.logout();
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
