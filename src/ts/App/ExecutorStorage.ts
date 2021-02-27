import IExecutorStorage from '../Dispatcher/ExecutorStorage';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import WalletListingController from '../Controllers/WalletListingController';
import AuthManager from '../Authorization/AuthManager';
import AuthoriztionController from '../Controllers/AuthorizationController';

export default class ExecutorStorage implements IExecutorStorage {

    async Retrieve(executor_id: string): Promise<RequestExecutor | undefined> {
        if(await AuthManager.IsAuthorized()) {
            return new WalletListingController();
        } else {
            return new AuthoriztionController();
        }
    }
}