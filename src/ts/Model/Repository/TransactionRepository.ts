import Http from '../../Network/Http';
import HttpResponse from '../../Network/HttpResponse';
import MalformedResponseException from '../../Network/MalformedResponseException';
import NetworkErrorException from '../../Network/NetworkErrorException';
import RequestFailedException from '../../Network/RequestFailedException';
import { RequestMethod } from '../../Network/RequestMethod';
import DateTime from '../../Utils/DateTime';
import RawTransaction from '../RawTransaction';
import Transaction from '../Transaction';
import TransactionCategory from '../TransactionCategory';
import { TransactionType } from '../TransactionType';
import Wallet from '../Wallet';
import Endpoints from './Endpoints';
import RepositoryFetchException from './RepositoryFetchException';
import RepositorySaveException from './RepositorySaveException';

type ApiResponseTransactionCategory = {
    description: string | null;
    id: number;
    name: string;
    transactionType: string;
};
type ApiResponseTransaction = {
    category: ApiResponseTransactionCategory;
    dateOfPurchase: string;
    description: string;
    id: number;
    isFinished: boolean;
    name: string;
    price: number;
    transactionIdReference: number | null;
};

export default class TransactionRepository {

    /**
     * Returns a list of all transactions in a given wallet.
     * If the attempt fails, throws a RepositoryFetchException.
     */
    public static async GetAllTransactions(wallet: Wallet): Promise<Transaction[]> {
        let response: HttpResponse;
        try {
            response = await Http.Request(Endpoints.GetTransactionsUri(wallet.Id));
        } catch(e) {
            throw this.ProcessFetchException(e);
        }
        let api_transactions = response.Response as ApiResponseTransaction[];

        let transactions: Transaction[] = [];
        for(let t of api_transactions) {
            transactions.push(this.CreateTransactionFromApi(t, wallet));
        }

        return transactions;
    }

    /**
     * Loads a transaction with the given identifier.
     * If the attempt fails, throws a RepositoryFetchException.
     * @param id Identifier of a transaction
     */
    public static async GetTransactionById(id: bigint, wallet: Wallet): Promise<Transaction | undefined> {
        let response: HttpResponse;
        try {
            response = await Http.Request(Endpoints.GetTransactionUri(id, wallet.Id));
        } catch(e) {
            throw this.ProcessFetchException(e);
        }
        let api_transaction = response.Response as ApiResponseTransaction;
        return this.CreateTransactionFromApi(api_transaction, wallet);
    }

    protected static CreateTransactionFromApi(api_transaction: ApiResponseTransaction, wallet: Wallet): Transaction {
        let category = new TransactionCategory(
            BigInt(api_transaction.category.id),
            api_transaction.category.name,
            api_transaction.category.description ?? '',
            api_transaction.category.transactionType as TransactionType
        );
        let transaction = new Transaction(
            BigInt(api_transaction.id),
            api_transaction.name,
            api_transaction.description,
            BigInt(api_transaction.price * 100),    // Price is stored in base units
            new Date(api_transaction.dateOfPurchase),
            category,
            api_transaction.isFinished,
            (api_transaction.transactionIdReference !== null) ? BigInt(api_transaction.transactionIdReference) : null,
            wallet
        );
        return transaction;
    }

    /**
     * Creates a new transaction. If fails, throws a RepositorySaveException.
     * @param wallet The wallet to add a transaction to
     * @param transaction The transaction data
     */
    public static async CreateNewTransaction(wallet: Wallet, transaction: RawTransaction): Promise<Transaction> {
        let payload = {
            dateOfPurchase: DateTime.ToInputFormat(transaction.DateTime),
            description: transaction.Description,
            name: transaction.Name,
            price: Number(transaction.Price) / 100,
            transactionIdReference: null
        };

        let response: HttpResponse;
        try {
            response = await Http.Request(
                Endpoints.GetCreateTransactionUri(wallet.Id, transaction.CategoryId),
                {
                    Method: RequestMethod.PUT,
                    Payload: payload
                }
            );
        } catch(e) {
            throw this.ProcessSaveException(e);
        }

        if(response.Status !== 201) {
            throw new RepositorySaveException(
                `An unexpected response encountered during the transaction saving. ` +
                `The server responded with HTTP code ${response.Status}. Expected 201.`);
        }

        let api_transaction = response.Response as ApiResponseTransaction;
        return this.CreateTransactionFromApi(api_transaction, wallet);
    }

    /**
     * Saves changes to the exiting transaction. If fails, throws a RepositorySaveException.
     * @param wallet Wallet the transaction is in
     * @param transaction The transaction data
     */
    public static async EditTransaction(wallet: Wallet, transaction: RawTransaction): Promise<void> {
        let payload = {
            id: transaction.Id?.toString() ?? null,
            dateOfPurchase: DateTime.ToInputFormat(transaction.DateTime),
            description: transaction.Description,
            name: transaction.Name,
            price: Number(transaction.Price) / 100,
            transactionIdReference: null
        };

        let response: HttpResponse;
        try {
            response = await Http.Request(
                Endpoints.GetEditTransactionUri(wallet.Id),
                {
                    Method: RequestMethod.POST,
                    Payload: payload
                }
            );
        } catch(e) {
            console.log(e);
            throw this.ProcessSaveException(e);
        }

        if(response.Status !== 202) {
            throw new RepositorySaveException(
                `An unexpected response encountered during the transaction saving. ` +
                `The server responded with HTTP code ${response.Status}. Expected 202.`);
        }
    }

    public static async RemoveTransaction(wallet: Wallet, transaction: { Id: bigint | undefined; }) {
        if(transaction.Id === undefined) {
            throw new RepositorySaveException(`Cannot remove a transaction with an undefined identifier.`);
        }

        let response: HttpResponse;
        try {
            response = await Http.Request(
                Endpoints.GetRemoveTransactionUri(wallet.Id, transaction.Id),
                {
                    Method: RequestMethod.DELETE
                }
            );
        } catch(e) {
            console.log(e);
            throw this.ProcessSaveException(e);
        }

        if(response.Status !== 204) {
            throw new RepositorySaveException(
                `An unexpected response encountered during the transaction saving. ` +
                `The server responded with HTTP code ${response.Status}. Expected 204.`);
        }
    }

    protected static ProcessFetchException(e: any): RepositoryFetchException {
        if(e instanceof RequestFailedException) {
            return new RepositoryFetchException(
                `Unable to download the transaction list. HTTP error ${e.ResponseData.Status}.`, e);
        }
        if(e instanceof NetworkErrorException) {
            return new RepositoryFetchException(
                `Unable to download the transaction list. Client is offline.`, e);
        }
        if(e instanceof MalformedResponseException) {
            return new RepositoryFetchException(
                `Unable to download the transaction list. The server response is malformed.`, e);
        }
        return new RepositoryFetchException(
            `Unable to download the transaction list. An unknown error occured.`);
    }

    protected static ProcessSaveException(e: any): RepositorySaveException {
        if(e instanceof RequestFailedException) {
            return new RepositorySaveException(
                `Unable to save the transaction to the server. HTTP error ${e.ResponseData.Status}`, e);
        }
        if(e instanceof NetworkErrorException) {
            return new RepositorySaveException(
                `Unable to upload the transaction to the server. Client is offline.`, e);
        }
        if(e instanceof MalformedResponseException) {
            return new RepositorySaveException(
                `There was an error during the transaction saving. Cannot understand the server response.`, e);
        }
        return new RepositorySaveException(
            `Unable to save the transaction to the server. An unknown error occurred.`);
    }
}