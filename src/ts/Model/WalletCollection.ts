import ElementNotFoundException from './ElementNotFoundException';
import WalletRepository from './Repository/WalletRepository';
import Wallet from './Wallet';

export default class WalletCollection {
    protected static Singleton: WalletCollection | undefined;
    public Wallets: Map<bigint, Wallet>;

    /**
     * Returns a collection of wallets. If they hadn't been
     * already loaded, fetches them from the repository.
     */
    public static GetCollection(): WalletCollection {
        if(this.Singleton === undefined) {
            this.Singleton = new WalletCollection(
                WalletRepository.GetAllWallets()
            );
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
     * an Element Not Found Exception is thrown.
     * @param id Id of the wallet to return.
     */
    public GetWalletById(id: bigint): Wallet {
        if(this.Wallets.has(id)) {
            return this.Wallets.get(id)!;
        }

        let wallet = WalletRepository.GetWalletById(id);
        if(wallet !== undefined) {
            this.Wallets.set(id, wallet);
            return wallet;
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