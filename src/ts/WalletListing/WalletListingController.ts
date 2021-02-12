import Command from '../Dispatcher/Command';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import WalletCollection from '../Model/WalletCollection';

export default class WalletListingController implements RequestExecutor {

    Execute(command: Command): void {
        let wallets = WalletCollection.GetCollection().GetAllWallets();
        console.log(wallets);
    }
}