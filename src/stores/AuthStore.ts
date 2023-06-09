import { Session } from "../types/dto/auth.dto";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { apiUrl } from "../config";
import { parseJwt } from "../utils/object";
import { Api } from "./Api/Api";
import { ERequestMethod, IResponse } from "./Api/Api.interfaces";

export interface ITokenPayload {
  email: string;
  userId: string;
  sessionId: string;
}

export class AuthStore {
  _session: Session | null = null;
  _authToken: string | null = null;
  _isUpdateAuth: boolean = false;

  apiInstanse: Api;

  constructor() {
    makeAutoObservable(this);

    this.apiInstanse = new Api(apiUrl);
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

  set isUpdateAuth(state: boolean) {
    runInAction(() => {
      this._isUpdateAuth = state;
    });
  }

  set authToken(token: string | null) {
    runInAction(() => {
      this._authToken = token;
    });
  }

  set session(session: Session | null) {
    runInAction(() => {
      this._session = session;
    });
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

  get session(): Session | null {
    return toJS(this._session);
  }
}
