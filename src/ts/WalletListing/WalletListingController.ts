import Command from '../Dispatcher/Command';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import WalletCollection from '../Model/WalletCollection';
import Presenter from '../Views/Presentation/Presenter';
import WalletsPage from '../Views/Wallets/WalletsPage';

export default class WalletListingController implements RequestExecutor {

    async Execute(command: Command): Promise<void> {
        let wallet_list_page = new WalletsPage();
        let page_awaiter = Presenter.DisplayPage(wallet_list_page);

        let collection = await WalletCollection.GetCollection();
        let wallets = collection.GetAllWallets();
        console.log(wallets);

        wallet_list_page.PopulateWallets(wallets);
        await page_awaiter;
    }
}