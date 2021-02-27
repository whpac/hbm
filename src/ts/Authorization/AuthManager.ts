import UserRepository from '../Model/Repository/UserRepository';
import SessionStorage from './SessionStorage';
import User from './User';

export default class AuthManager {
    protected static _IsAuthorized: boolean | undefined;
    protected static CurrentUser: User | undefined;
    private static AuthToken: string | undefined;

    public static async IsAuthorized(): Promise<boolean> {
        if(this._IsAuthorized === undefined) {
            this._IsAuthorized = await this.CheckIsAuthorized();
        }
        return this._IsAuthorized;
    }

    public static InvalidateAuthorization() {
        this._IsAuthorized = undefined;
        this.CurrentUser = undefined;
    }

    public static GetAuthToken(): string | undefined {
        return this.AuthToken;
    }

    public static async TryToLogIn(login: string, password: string) {
        let token = this.RetrieveToken(login, password);

        let prev_token = this.AuthToken;
        this.AuthToken = token;

        this.InvalidateAuthorization();
        let is_authorized = await this.IsAuthorized();

        if(!is_authorized) {
            this.InvalidateAuthorization();
            this.AuthToken = prev_token;
            return false;
        }

        this.SaveToken();
        return true;
    }

    public static RestoreToken() {
        let token = SessionStorage.Get('auth_token');
        if(token === null) return;

        this.InvalidateAuthorization();
        this.AuthToken = token;
    }

    protected static SaveToken() {
        SessionStorage.Set('auth_token', this.AuthToken ?? null);
    }

    protected static async CheckIsAuthorized() {
        try {
            let current_user: User = await UserRepository.GetCurrent();
            if(current_user.IsAuthorized) {
                this.CurrentUser = current_user;
            }
            return current_user.IsAuthorized;
        } catch(e) {
            this.CurrentUser = undefined;
            return false;
        }
    }

    protected static RetrieveToken(login: string, password: string) {
        let cred = login + ':' + password;
        return btoa(cred);
    }
}