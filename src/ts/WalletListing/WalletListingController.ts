import Command from '../Dispatcher/Command';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import Wallet from '../Model/Wallet';
import WalletCollection from '../Model/WalletCollection';
import Component from '../Views/Common/Component';
import ComponentEvent from '../Views/Common/ComponentEvent';
import DialogPresenter from '../Views/Presentation/DialogPresenter';
import PagePresenter from '../Views/Presentation/PagePresenter';
import EditTransactionDialog from '../Views/Wallets/EditTransactionDialog/EditTransactionDialog';
import TransactionDto from '../Views/Wallets/TransactionDto';
import WalletDto from '../Views/Wallets/WalletDto';
import WalletsPage from '../Views/Wallets/WalletsPage';

export default class WalletListingController implements RequestExecutor {
    protected WalletsPage: WalletsPage | undefined;
    protected WalletCollection: WalletCollection | undefined;
    protected CurrentWallet: Wallet | undefined;

    async Execute(command: Command): Promise<void> {
        this.WalletsPage = new WalletsPage();
        this.WalletsPage.AddEventListener('WalletSelectionChanged', this.DisplayWalletRequested.bind(this));
        this.WalletsPage.AddEventListener('EditTransactionRequested', this.EditTransactionRequested.bind(this));
        this.WalletsPage.AddEventListener('AddTransactionRequested', this.NewTransactionRequested.bind(this));
        let page_awaiter = PagePresenter.DisplayPage(this.WalletsPage);

        this.WalletCollection = await WalletCollection.GetCollection();
        let wallets = this.WalletCollection.GetAllWallets();

        let wallet_dtos: WalletDto[] = [];
        for(let wallet of wallets) {
            let dto = new WalletDto(wallet);

            if(dto.IsDefault) wallet_dtos.unshift(dto);
            else wallet_dtos.push(dto);
        }

        this.WalletsPage.PopulateWallets(wallet_dtos);
        await page_awaiter;
    }

    protected async DisplayWalletRequested() {
        if(this.WalletCollection === undefined) return;

        let wallet_dto = this.WalletsPage?.GetSelectedWallet();
        this.WalletsPage?.StartedFetchingTransactions();

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

        this.CurrentWallet = wallet;
        this.WalletsPage?.DisplayWalletTransactions(wallet_dto, transaction_dtos);
    }

    protected EditTransactionRequested() {
        let transaction_dto = this.WalletsPage?.GetSelectedTransaction();
        if(transaction_dto === undefined) return;

        this.DisplayEditTransactionDialog(transaction_dto);
    }

    protected NewTransactionRequested() {
        this.DisplayEditTransactionDialog(undefined);
    }

    protected DisplayEditTransactionDialog(transaction: TransactionDto | undefined) {
        let dialog = new EditTransactionDialog();
        dialog.Populate(transaction);
        dialog.AddEventListener(
            'SaveRequested',
            ((d: Component, e: ComponentEvent) =>
                this.SaveTransaction(d as EditTransactionDialog, e.Data)).bind(this)
        );
        DialogPresenter.DisplayDialog(dialog);
    }

    protected async SaveTransaction(dialog: EditTransactionDialog, transaction_dto: TransactionDto) {
        if(this.CurrentWallet === undefined) return;
        let transactions = await this.CurrentWallet.GetTransactions();

        if(transaction_dto.Id === undefined) {
            try {
                await transactions.CreateNew(transaction_dto);
                this.DisplayWalletRequested();  // Refresh the wallet view
                dialog.Hide();
            } catch(e) {

            }
        } else {
            try {

            } catch(e) {

            }
        }
    }
}