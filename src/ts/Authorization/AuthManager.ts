import UserRepository from '../Model/Repository/UserRepository';
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
        // return 'dGVzdDI4QGV4YW1';
        // return 'dGVzdDI4QGV4YW1wbGUuY29tOmhhc2xv';
        return this.AuthToken;
    }

    public static async TryToLogIn(login: string, password: string) {
        let token = this.RetrieveToken(login, password);

        let prev_token = this.AuthToken;
        this.AuthToken = token;

        this.InvalidateAuthorization();
        let is_authorized = await this.IsAuthorized();

        if(!is_authorized) {
            this.AuthToken = prev_token;
            return false;
        }

        return true;
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