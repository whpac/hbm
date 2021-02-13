import ElementNotFoundException from './ElementNotFoundException';
import WalletRepository from './Repository/WalletRepository';
import Wallet from './Wallet';

export default class WalletCollection {
    protected static Singleton: WalletCollection | undefined;
    public Wallets: Map<bigint, Wallet>;

    /**
     * Returns a collection of wallets. If they hadn't been
     * already loaded, fetches them from the repository.
     * 
     * Should it be impossible to load the wallets, a RepositoryFetchException is thrown.
     */
    public static async GetCollection(): Promise<WalletCollection> {
        if(this.Singleton === undefined) {
            let wallets = await WalletRepository.GetAllWallets();
            this.Singleton = new WalletCollection(wallets);
        }
        return this.Singleton;
    }

    protected constructor(wallets: Wallet[]) {
        this.Wallets = new Map();

        for(let wallet of wallets) {
            this.Wallets.set(wallet.Id, wallet);
        }
    }

    /**
     * Returns a wallet with the specified id. If it doesn't exist,
     * an ElementNotFoundException is thrown.
     * @param id Id of the wallet to return.
     */
    public async GetWalletById(id: bigint): Promise<Wallet> {
        if(this.Wallets.has(id)) {
            return this.Wallets.get(id)!;
        }

        try {
            let wallet = await WalletRepository.GetWalletById(id);
            if(wallet !== undefined) {
                this.Wallets.set(id, wallet);
                return wallet;
            }
        } catch(e) {
            // It means the download has failed. Throw an ElementNotFoundException then.
        }

        throw new ElementNotFoundException(`Wallet with id '${id}' doesn't exist in this collection.`, id);
    }

    /**
     * Returns all wallets in this collection
     */
    public GetAllWallets(): Wallet[] {
        return Array.from(this.Wallets.values());
    }
}