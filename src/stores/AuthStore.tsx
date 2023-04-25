import { Session } from "../types/dto/auth.dto";
import { IResponse, api } from "../utils/api";
import { autorun, makeAutoObservable, runInAction, toJS } from "mobx";

const SESSION_KEY = "session";

export class AuthStore {
  _session: Session | null = null;

  constructor() {
    makeAutoObservable(this);

    this.getLocalStorage();

    autorun(() => {
      if (this._session) {
        this.setLocalStorage(this._session);
      }
    });
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

  async updateAuth(): Promise<IResponse<Session>> {
    const session = await api.post<Session>("auth/update/auth");

    runInAction(() => {
      if (session.data) {
        this._session = session.data;
      }
    });

    return session;
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

  async checkExpiredAuth(session: Session) {
    const now = new Date().getTime();
    const expiresAt = new Date(session.expiresAt).getTime();
    const deltaTime = 5 * (1000 * 60 * 60); // 5 hour
    if (now + expiresAt > deltaTime) {
    }
  }

  setLocalStorage(session: Session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  getLocalStorage(): Session | null {
    if (this._session) {
      return this._session;
    }

    const sessionStorage: Session | null = JSON.parse(
      localStorage.getItem(SESSION_KEY) || "null"
    );
    if (sessionStorage) {
      return sessionStorage;
    }
    return null;
  }

  get session() {
    return toJS(this._session);
  }
}
