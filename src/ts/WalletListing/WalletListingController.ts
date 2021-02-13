import Command from '../Dispatcher/Command';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import WalletCollection from '../Model/WalletCollection';
import Presenter from '../Views/Presentation/Presenter';
import WalletDto from '../Views/Wallets/WalletDto';
import WalletsPage from '../Views/Wallets/WalletsPage';

export default class WalletListingController implements RequestExecutor {
    protected WalletsPage: WalletsPage | undefined;

    async Execute(command: Command): Promise<void> {
        this.WalletsPage = new WalletsPage();
        this.WalletsPage.AddEventListener('WalletSelectionChanged', this.DisplayWalletRequested.bind(this));
        let page_awaiter = Presenter.DisplayPage(this.WalletsPage);

        let collection = await WalletCollection.GetCollection();
        let wallets = collection.GetAllWallets();

        let wallet_dtos: WalletDto[] = [];
        for(let wallet of wallets) {
            let dto = new WalletDto(
                wallet.Id,
                wallet.Name,
                wallet.Balance,
                wallet.Balance > 0
            );

            if(dto.IsDefault) wallet_dtos.unshift(dto);
            else wallet_dtos.push(dto);
        }

        this.WalletsPage.PopulateWallets(wallet_dtos);
        await page_awaiter;
    }

    protected DisplayWalletRequested() {
        let wallet = this.WalletsPage?.GetSelectedWallet();
        console.log(wallet?.Name);
    }
}