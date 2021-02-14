import Http from '../../Network/Http';
import HttpResponse from '../../Network/HttpResponse';
import MalformedResponseException from '../../Network/MalformedResponseException';
import NetworkErrorException from '../../Network/NetworkErrorException';
import RequestFailedException from '../../Network/RequestFailedException';
import Transaction from '../Transaction';
import TransactionCategory from '../TransactionCategory';
import { TransactionType } from '../TransactionType';
import Wallet from '../Wallet';
import Endpoints from './Endpoints';
import RepositoryFetchException from './RepositoryFetchException';

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
            throw this.ProcessException(e);
        }
        let api_transactions = response.Response as ApiResponseTransaction[];

        let transactions: Transaction[] = [];
        for(let t of api_transactions) {
            let category = new TransactionCategory(
                BigInt(t.category.id),
                t.category.name,
                t.category.description ?? '',
                t.category.transactionType as TransactionType
            );

            transactions.push(new Transaction(
                BigInt(t.id),
                t.name,
                t.description,
                BigInt(t.price * 100),    // Price is stored in base units
                new Date(t.dateOfPurchase),
                category,
                t.isFinished,
                (t.transactionIdReference !== null) ? BigInt(t.transactionIdReference) : null
            ));
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
            throw this.ProcessException(e);
        }
        let api_transaction = response.Response as ApiResponseTransaction;

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
            (api_transaction.transactionIdReference !== null) ? BigInt(api_transaction.transactionIdReference) : null
        );

        return transaction;
    }

    protected static ProcessException(e: any): RepositoryFetchException {
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
            `Unable to download the transaction list. An unknown error occured.`, e);
    }
}