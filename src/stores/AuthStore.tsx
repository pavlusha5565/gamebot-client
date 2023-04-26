import { Session } from "../types/dto/auth.dto";
import { IResponse, api } from "../utils/api";
import { autorun, makeAutoObservable, runInAction, toJS } from "mobx";

const SESSION_KEY = "session";

const oneHourInSecond = 1000 * 60 * 60;

export class AuthStore {
  _session: Session | null = null;
  _authToken: string | null = null;

  timeoutRef: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);

    this._session = this.getLocalStorage<Session>(SESSION_KEY);

    autorun(() => {
      if (this._session) {
        this.setLocalStorage(SESSION_KEY, this.session);
      }
    });

    this.subscribeUpdate();
  }

  async login(email: string, password: string): Promise<IResponse<Session>> {
    const session = await api.post<Session>("auth/login", {
      email,
      password,
    });

    if (session.data) {
      runInAction(() => {
        this._session = session.data;
      });
    }

    return session;
  }

  async register(email: string, password: string): Promise<IResponse<Session>> {
    const session = await api.post<Session>("auth/register", {
      email,
      password,
    });

    runInAction(() => {
      if (session.data) {
        this._session = session.data;
      }
    });

    return session;
  }

  async subscribeUpdate() {
    if (this.timeoutRef) {
      return;
    }
    if (this.session?.refreshToken) {
      const isValidSession = this.checkValidSession(
        this.session,
        oneHourInSecond * 5
      );
      if (!isValidSession) {
        await this.updateRefresh();
      }

      await this.updateAuth();
      this.timeoutRef = setTimeout(async () => {
        this.timeoutRef = null;
        await this.subscribeUpdate();
      }, 1000 * 60 * 8);
    }
  }

  unsubscribeUpdate() {
    clearTimeout(this.timeoutRef || undefined);
    this.timeoutRef = null;
  }

  async updateAuth(): Promise<string | null> {
    const token = await api.post<string>("auth/update/auth", null, {
      headers: {
        Refresh: this.bearerRefresh,
      },
    });

    if (token.status === 200) {
      runInAction(() => {
        if (token.data) {
          this._authToken = token.data;
        }
      });
    }
    return token.data;
  }

  async updateRefresh(): Promise<IResponse<Session>> {
    const session = await api.post<Session>("auth/update/refresh");

    runInAction(() => {
      if (session.data) {
        this._session = session.data;
      }
    });

    return session;
  }

  checkValidSession(session: Session, deltaTime: number): boolean {
    const now = new Date().getTime();
    const expiresAt = new Date(session.expiresAt).getTime();
    if (now + deltaTime > expiresAt) {
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

  get bearerRefresh(): string {
    if (this.session?.refreshToken) {
      return `Bearer ${this.session?.refreshToken}`;
    }
    return "";
  }

  get bearerAuth(): string {
    return `Bearer ${this._authToken}`;
  }

  get session(): Session | null {
    return toJS(this._session);
  }
}
