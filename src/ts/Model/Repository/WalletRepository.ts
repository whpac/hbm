import Http from '../../Network/Http';
import HttpResponse from '../../Network/HttpResponse';
import MalformedResponseException from '../../Network/MalformedResponseException';
import NetworkErrorException from '../../Network/NetworkErrorException';
import RequestFailedException from '../../Network/RequestFailedException';
import Wallet from '../Wallet';
import Endpoints from './Endpoints';
import RepositoryFetchException from './RepositoryFetchException';

type ApiResponseWallet = {
    balance: number;
    id: number;
    name: string;
    user: never;
};

export default class WalletRepository {

    /**
     * Returns a list of all wallets belonging to the current user.
     * If the attempt fails, throws a RepositoryFetchException.
     */
    public static async GetAllWallets(): Promise<Wallet[]> {
        let response: HttpResponse;
        try {
            response = await Http.Request(Endpoints.GetWalletsUri());
        } catch(e) {
            throw this.ProcessException(e);
        }
        let api_wallets = response.Response as ApiResponseWallet[];

        let wallets: Wallet[] = [];
        for(let w of api_wallets) {
            wallets.push(new Wallet(
                BigInt(w.id),
                w.name,
                BigInt(w.balance * 100),    // Balance is stored in base units
                w.user
            ));
        }

        return wallets;
    }

    /**
     * Loads a wallet with the given identifier.
     * If the attempt fails, throws a RepositoryFetchException.
     * @param id Identifier of a wallet
     */
    public static async GetWalletById(id: bigint): Promise<Wallet | undefined> {
        let response: HttpResponse;
        try {
            response = await Http.Request(Endpoints.GetWalletUri(id));
        } catch(e) {
            throw this.ProcessException(e);
        }
        let api_wallet = response.Response as ApiResponseWallet;

        let wallet = new Wallet(
            BigInt(api_wallet.id),
            api_wallet.name,
            BigInt(api_wallet.balance * 100),   // Balance is stored in base units
            api_wallet.user
        );

        return wallet;
    }

    protected static ProcessException(e: any): RepositoryFetchException {
        if(e instanceof RequestFailedException) {
            return new RepositoryFetchException(
                `Unable to download the wallet list. HTTP error ${e.ResponseData.Status}.`, e);
        }
        if(e instanceof NetworkErrorException) {
            return new RepositoryFetchException(
                `Unable to download the wallet list. Client is offline.`, e);
        }
        if(e instanceof MalformedResponseException) {
            return new RepositoryFetchException(
                `Unable to download the wallet list. The server response is malformed.`, e);
        }
        return new RepositoryFetchException(
            `Unable to download the wallet list. An unknown error occured.`, e);
    }
}