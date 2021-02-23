import Command from '../Dispatcher/Command';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import RepositorySaveException from '../Model/Repository/RepositorySaveException';
import Wallet from '../Model/Wallet';
import WalletCollection from '../Model/WalletCollection';
import Component from '../Views/Common/Component';
import ComponentEvent from '../Views/Common/ComponentEvent';
import DialogPresenter from '../Views/Presentation/DialogPresenter';
import PagePresenter from '../Views/Presentation/PagePresenter';
import EditTransactionDialog from '../Views/Wallets/EditTransactionDialog/EditTransactionDialog';
import EditWalletDialog from '../Views/Wallets/EditWalletDialog/EditWalletDialog';
import RemoveTransactionDialog from '../Views/Wallets/RemoveTransactionDialog/RemoveTransactionDialog';
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
        this.WalletsPage.AddEventListener('RemoveTransactionRequested', this.RemoveTransactionRequested.bind(this));
        this.WalletsPage.AddEventListener('EditWalletRequested', this.EditWalletRequested.bind(this));
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
                transaction_dtos.push(new TransactionDto(transaction));
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

    protected RemoveTransactionRequested() {
        let transaction_dto = this.WalletsPage?.GetSelectedTransaction();
        if(transaction_dto === undefined) return;

        this.DisplayRemoveTransactionDialog(transaction_dto);
    }

    protected EditWalletRequested() {
        let wallet_dto = this.WalletsPage?.GetSelectedWallet();
        if(wallet_dto === undefined) return;

        this.DisplayEditWalletDialog(wallet_dto);
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

    protected DisplayRemoveTransactionDialog(transaction: TransactionDto) {
        let dialog = new RemoveTransactionDialog();
        dialog.Populate(transaction);
        dialog.AddEventListener(
            'RemoveRequested',
            ((d: Component, e: ComponentEvent) =>
                this.RemoveTransaction(d as RemoveTransactionDialog, e.Data)).bind(this)
        );
        DialogPresenter.DisplayDialog(dialog);
    }

    protected DisplayEditWalletDialog(wallet: WalletDto) {
        let dialog = new EditWalletDialog();
        dialog.Populate(wallet);
        dialog.AddEventListener(
            'SaveRequested',
            ((d: Component, e: ComponentEvent) =>
                this.SaveWallet(d as EditWalletDialog, e.Data)).bind(this)
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
                if(e instanceof RepositorySaveException) {
                    dialog.OnSaveFailed(e.Message);
                } else {
                    dialog.OnSaveFailed('An unknown error occurred.');
                }
            }
        } else {
            try {
                let transaction = await transactions.GetTransactionById(transaction_dto.Id);
                await transaction.MakeChanges(transaction_dto);
                dialog.Hide();
            } catch(e) {
                if(e instanceof RepositorySaveException) {
                    dialog.OnSaveFailed(e.Message);
                } else {
                    dialog.OnSaveFailed('An unknown error occurred.');
                }
            }
        }
    }

    protected async RemoveTransaction(dialog: RemoveTransactionDialog, transaction_dto: TransactionDto) {
        if(this.CurrentWallet === undefined || transaction_dto.Id === undefined) return;
        let transactions = await this.CurrentWallet.GetTransactions();

        try {
            let transaction = await transactions.GetTransactionById(transaction_dto.Id);
            await transaction.Remove();
            this.DisplayWalletRequested();  // Refresh the wallet view
            dialog.Hide();
        } catch(e) {
            if(e instanceof RepositorySaveException) {
                dialog.OnRemoveFailed(e.Message);
            } else {
                dialog.OnRemoveFailed('An unknown error occurred.');
            }
        }
    }

    protected async SaveWallet(dialog: EditWalletDialog, wallet_dto: WalletDto) {
        if(this.WalletCollection === undefined) return;

        try {
            let wallet = await this.WalletCollection.GetWalletById(wallet_dto.Id);
            await wallet.Rename(wallet_dto.Name);
            this.DisplayWalletRequested();
            dialog.Hide();
        } catch(e) {
            if(e instanceof RepositorySaveException) {
                dialog.OnSaveFailed(e.Message);
            } else {
                dialog.OnSaveFailed('An unknown error occurred.');
            }
        }
    }
}