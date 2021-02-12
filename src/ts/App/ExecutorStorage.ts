import IExecutorStorage from '../Dispatcher/ExecutorStorage';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import WalletListingController from '../WalletListing/WalletListingController';

export default class ExecutorStorage implements IExecutorStorage {

    Retrieve(executor_id: string): RequestExecutor | undefined {
        return new WalletListingController();
    }
}