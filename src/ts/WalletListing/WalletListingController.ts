import Command from '../Dispatcher/Command';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import WalletCollection from '../Model/WalletCollection';

export default class WalletListingController implements RequestExecutor {

    async Execute(command: Command): Promise<void> {
        let collection = await WalletCollection.GetCollection();
        let wallets = collection.GetAllWallets();
        console.log(wallets);
    }
}