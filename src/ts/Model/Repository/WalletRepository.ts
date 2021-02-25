import Http from '../../Network/Http';
import HttpResponse from '../../Network/HttpResponse';
import MalformedResponseException from '../../Network/MalformedResponseException';
import NetworkErrorException from '../../Network/NetworkErrorException';
import RequestFailedException from '../../Network/RequestFailedException';
import { RequestMethod } from '../../Network/RequestMethod';
import { RawWallet } from '../RawWallet';
import Wallet from '../Wallet';
import Endpoints from './Endpoints';
import RepositoryFetchException from './RepositoryFetchException';
import RepositorySaveException from './RepositorySaveException';

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
            throw this.ProcessFetchException(e);
        }
        let api_wallets = response.Response as ApiResponseWallet[];

        let wallets: Wallet[] = [];
        for(let w of api_wallets) {
            wallets.push(this.CreateWalletFromApi(w));
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
            throw this.ProcessFetchException(e);
        }
        let api_wallet = response.Response as ApiResponseWallet;

        let wallet = this.CreateWalletFromApi(api_wallet);
        return wallet;
    }

    protected static CreateWalletFromApi(api_wallet: ApiResponseWallet) {
        return new Wallet(
            BigInt(api_wallet.id),
            api_wallet.name,
            BigInt(api_wallet.balance * 100),   // Balance is stored in base units
            api_wallet.user
        );
    }

    /**
     * Created a wallet. If fails, throws a RepositorySaveException
     * @param wallet The wallet to rename
     * @param new_name The new name
     */
    public static async CreateWallet(wallet_data: RawWallet): Promise<Wallet> {
        let payload = {
            name: wallet_data.Name,
            balance: Number(wallet_data.Balance) / 100
        };

        let response: HttpResponse;
        try {
            response = await Http.Request(
                Endpoints.GetCreateWalletUri(),
                {
                    Method: RequestMethod.POST,
                    Payload: payload
                }
            );
        } catch(e) {
            console.log(e);
            throw this.ProcessSaveException(e);
        }

        if(response.Status !== 201) {
            throw new RepositorySaveException(
                `An unexpected response encountered during the wallet creation. ` +
                `The server responded with HTTP code ${response.Status}. Expected 201.`);
        }

        return this.CreateWalletFromApi(response.Response as ApiResponseWallet);
    }

    /**
     * Renames a wallet. If fails, throws a RepositorySaveException
     * @param wallet The wallet to rename
     * @param new_name The new name
     */
    public static async RenameWallet(wallet: Wallet, new_name: string) {
        let payload = {
            id: wallet.Id.toString(),
            name: new_name,
            balance: Number(wallet.Balance) / 100
        };

        let response: HttpResponse;
        try {
            response = await Http.Request(
                Endpoints.GetEditWalletUri(),
                {
                    Method: RequestMethod.POST,
                    Payload: payload
                }
            );
        } catch(e) {
            console.log(e);
            throw this.ProcessSaveException(e);
        }

        if(response.Status !== 201) {
            throw new RepositorySaveException(
                `An unexpected response encountered during the wallet saving. ` +
                `The server responded with HTTP code ${response.Status}. Expected 201.`);
        }
    }

    public static async RemoveWallet(wallet: { Id: bigint | undefined; }) {
        if(wallet.Id === undefined) {
            throw new RepositorySaveException(`Cannot remove a wallet with an undefined identifier.`);
        }

        let response: HttpResponse;
        try {
            response = await Http.Request(
                Endpoints.GetRemoveWalletUri(wallet.Id),
                {
                    Method: RequestMethod.DELETE
                }
            );
        } catch(e) {
            console.log(e);
            throw this.ProcessRemoveException(e);
        }

        if(response.Status !== 204) {
            throw new RepositorySaveException(
                `An unexpected response encountered during the wallet removal. ` +
                `The server responded with HTTP code ${response.Status}. Expected 204.`);
        }
    }

    protected static ProcessFetchException(e: any): RepositoryFetchException {
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

    protected static ProcessSaveException(e: any): RepositorySaveException {
        if(e instanceof RequestFailedException) {
            return new RepositorySaveException(
                `Unable to save the wallet to the server. HTTP error ${e.ResponseData.Status}`, e);
        }
        if(e instanceof NetworkErrorException) {
            return new RepositorySaveException(
                `Unable to upload the wallet to the server. Client is offline.`, e);
        }
        if(e instanceof MalformedResponseException) {
            return new RepositorySaveException(
                `There was an error during the wallet saving. Cannot understand the server response.`, e);
        }
        return new RepositorySaveException(
            `Unable to save the wallet to the server. An unknown error occurred.`);
    }

    protected static ProcessRemoveException(e: any): RepositorySaveException {
        if(e instanceof RequestFailedException) {
            return new RepositorySaveException(
                `Unable to remove the wallet from the server. HTTP error ${e.ResponseData.Status}`, e);
        }
        if(e instanceof NetworkErrorException) {
            return new RepositorySaveException(
                `Unable to remove the wallet from the server. Client is offline.`, e);
        }
        if(e instanceof MalformedResponseException) {
            return new RepositorySaveException(
                `There was an error during the wallet removal. Cannot understand the server response.`, e);
        }
        return new RepositorySaveException(
            `Unable to remove the wallet from the server. An unknown error occurred.`);
    }
}