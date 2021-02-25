import UserRepository from '../Model/Repository/UserRepository';
import User from './User';

export default class AuthManager {
    protected static _IsAuthorized: boolean | undefined;

    public static async IsAuthorized(): Promise<boolean> {
        if(this._IsAuthorized === undefined) {
            this._IsAuthorized = await this.CheckIsAuthorized();
        }
        return this._IsAuthorized;
    }

    public static InvalidateAuthorization() {
        this._IsAuthorized = undefined;
    }

    public static GetAuthToken(): string | undefined {
        return 'dGVzdDI3QGV4YW1wbGUuY29tOmhhc2xv';
    }

    protected static async CheckIsAuthorized() {
        try {
            let current_user: User = await UserRepository.GetCurrent();
            return current_user.IsAuthorized;
        } catch(e) {
            return false;
        }
    }
}