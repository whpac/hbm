import AuthorizationProvider from '../Network/AuthorizationProvider';
import AuthManager from './AuthManager';

export default class BasicAuthorizationProvider implements AuthorizationProvider {

    Authorize(xhr: XMLHttpRequest): void {
        let token = AuthManager.GetAuthToken();
        if(token !== undefined) {
            xhr.setRequestHeader('Authorization', 'Basic ' + token);
        }
    }
}