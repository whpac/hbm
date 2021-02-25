import Http from '../../Network/Http';
import HttpResponse from '../../Network/HttpResponse';
import MalformedResponseException from '../../Network/MalformedResponseException';
import NetworkErrorException from '../../Network/NetworkErrorException';
import RequestFailedException from '../../Network/RequestFailedException';
import User from '../User';
import Endpoints from './Endpoints';
import RepositoryFetchException from './RepositoryFetchException';

type ApiUser = {
    authenticated: boolean;
    name: string;
};
type ApiProfile = {
    email: string;
    favoriteWalletId: number;
};

export default class UserRepository {

    public static async GetCurrent(): Promise<User> {
        let user_response: HttpResponse;
        let profile_response: HttpResponse;
        try {
            user_response = await Http.Request(Endpoints.GetUserUri());

            if(user_response.Response.authenticated !== true) {
                return new User('Anonymous', 'anonymous@invalid.com', BigInt(0), false);
            }

            profile_response = await Http.Request(Endpoints.GetUserProfileUri());
        } catch(e) {
            throw this.ProcessFetchException(e);
        }
        let api_user = user_response.Response as ApiUser;
        let api_profile = profile_response.Response as ApiProfile;

        return this.CreateUserFromApi(api_user, api_profile);
    }

    protected static CreateUserFromApi(user: ApiUser, profile: ApiProfile): User {
        return new User(
            user.name,
            profile.email,
            BigInt(profile.favoriteWalletId),
            user.authenticated
        );
    }

    protected static ProcessFetchException(e: any): RepositoryFetchException {
        if(e instanceof RequestFailedException) {
            return new RepositoryFetchException(
                `Unable to download the current user. HTTP error ${e.ResponseData.Status}.`, e);
        }
        if(e instanceof NetworkErrorException) {
            return new RepositoryFetchException(
                `Unable to download the current user. Client is offline.`, e);
        }
        if(e instanceof MalformedResponseException) {
            return new RepositoryFetchException(
                `Unable to download the current user. The server response is malformed.`, e);
        }
        return new RepositoryFetchException(
            `Unable to download the current user. An unknown error occured.`, e);
    }
}