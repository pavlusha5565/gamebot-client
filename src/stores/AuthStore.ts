import { Session } from "../types/dto/auth.dto";
import { autorun, makeAutoObservable, runInAction, toJS } from "mobx";
import { apiUrl } from "../config";
import { parseJwt } from "../utils/object";
import { Api } from "./Api/Api";
import { ERequestMethod, IResponse } from "./Api/Api.interfaces";

export interface ITokenPayload {
  email: string;
  userId: string;
  sessionId: string;
}

const SESSION_KEY = "session";

export class AuthStore {
  _session: Session | null = null;
  _authToken: string | null = null;
  _isUpdateAuth: boolean = false;

  apiInstanse: Api;

  timeoutRef: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);

    this.apiInstanse = new Api(apiUrl);

    this._session = this.getLocalStorage<Session>(SESSION_KEY);
    autorun(() => {
      this.setLocalStorage(SESSION_KEY, this.session);
    });
  }

  async login(email: string, password: string): Promise<IResponse<Session>> {
    const session = await this.apiInstanse.makeRequest<Session>("auth/login", {
      method: ERequestMethod.post,
      variables: { email, password },
    });

    this.session = session.data;
    return session;
  }

  async logout() {
    if (this.session?.refreshToken) {
      await this.apiInstanse.makeRequest<Session>("auth/logout", {
        method: ERequestMethod.post,
      });
    }
    this.session = null;
  }

  async register(email: string, password: string): Promise<IResponse<Session>> {
    const session = await this.apiInstanse.makeRequest<Session>(
      "auth/register",
      {
        method: ERequestMethod.post,
        variables: { email, password },
      }
    );

    this.session = session.data;
    return session;
  }

  async updateAuth(): Promise<string | null> {
    this.authToken = null;
    this.isUpdateAuth = true;

    const response = await this.apiInstanse.makeRequest<{ token: string }>(
      "auth/update/auth",
      {
        method: ERequestMethod.post,
        headers: {
          Refresh: this.bearerRefresh,
        },
      }
    );

    if (response.status === 200) {
      this.authToken = response.data?.token || null;
      this.isUpdateAuth = false;
      return this.authToken;
    } else {
      this.session = null;
    }
    return null;
  }

  async updateRefresh(): Promise<IResponse<Session>> {
    const session = await this.apiInstanse.makeRequest<Session>(
      "auth/update/refresh",
      {
        method: ERequestMethod.post,
      }
    );

    if (session.data) {
      this.session = session.data;
    } else if (session.error) {
      this.session = null;
      throw new Error(session.error.message);
    }

    return session;
  }

  checkValidSession(): boolean {
    const now = new Date().getTime();
    if (!this.session) {
      return false;
    }
    const expiresAt = new Date(this.session.expiresAt).getTime();
    if (now > expiresAt) {
      return false;
    }
    return true;
  }

  setLocalStorage(key: string, data: object | null) {
    if (!data) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  getLocalStorage<T extends object = object>(key: string): T | null {
    return JSON.parse(localStorage.getItem(key) || "null");
  }

  get isAuth(): boolean {
    if (!this.authToken || !this.session) {
      return false;
    }
    const jwtData = parseJwt<ITokenPayload>(this.authToken);
    const exp = new Date(jwtData.exp).getTime();
    const now = new Date().getTime();
    if (now > exp) {
      return false;
    }
    return true;
  }

  set isUpdateAuth(state: boolean) {
    runInAction(() => {
      this._isUpdateAuth = state;
    });
  }

  get bearerRefresh(): string {
    if (this.session?.refreshToken) {
      return `Bearer ${this.session?.refreshToken}`;
    }
    return "";
  }

  get bearerAuth(): string {
    return `Bearer ${this._authToken}`;
  }

  get authToken(): string | null {
    return toJS(this._authToken);
  }

  set authToken(token: string | null) {
    runInAction(() => {
      this._authToken = token;
    });
  }

  get session(): Session | null {
    return toJS(this._session);
  }

  set session(session: Session | null) {
    runInAction(() => {
      this._session = session;
    });
  }
}
