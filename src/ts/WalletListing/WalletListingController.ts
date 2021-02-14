import Command from '../Dispatcher/Command';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import Wallet from '../Model/Wallet';
import WalletCollection from '../Model/WalletCollection';
import Presenter from '../Views/Presentation/Presenter';
import TransactionDto from '../Views/Wallets/TransactionDto';
import WalletDto from '../Views/Wallets/WalletDto';
import WalletsPage from '../Views/Wallets/WalletsPage';

export default class WalletListingController implements RequestExecutor {
    protected WalletsPage: WalletsPage | undefined;
    protected WalletCollection: WalletCollection | undefined;

    async Execute(command: Command): Promise<void> {
        this.WalletsPage = new WalletsPage();
        this.WalletsPage.AddEventListener('WalletSelectionChanged', this.DisplayWalletRequested.bind(this));
        let page_awaiter = Presenter.DisplayPage(this.WalletsPage);

        this.WalletCollection = await WalletCollection.GetCollection();
        let wallets = this.WalletCollection.GetAllWallets();

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

    protected async DisplayWalletRequested() {
        if(this.WalletCollection === undefined) return;

        let wallet_dto = this.WalletsPage?.GetSelectedWallet();

        let wallet: Wallet | undefined;
        let transaction_dtos: TransactionDto[] = [];
        if(wallet_dto !== undefined) {
            wallet = await this.WalletCollection.GetWalletById(wallet_dto?.Id);
            let transactions = await wallet.GetTransactions();

            for(let transaction of transactions.GetAllTransactions()) {
                transaction_dtos.push(new TransactionDto(
                    transaction.Id,
                    transaction.Name,
                    transaction.Description,
                    transaction.Price,
                    transaction.DateTime,
                    transaction.Category
                ));
            }
        }

        this.WalletsPage?.DisplayWalletTransactions(wallet_dto, transaction_dtos);
    }
}