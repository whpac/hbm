import ElementNotFoundException from './ElementNotFoundException';
import WalletRepository from './Repository/WalletRepository';
import Wallet from './Wallet';

type EventNames = 'WalletRemoved';
type EventHandler = (sender: WalletCollection, event_data: WalletCollectionEventData) => void;
export type WalletCollectionEventData = {
    EventName: EventNames;
    Wallet: Wallet;
};

export default class WalletCollection {
    protected static Singleton: WalletCollection | undefined;
    protected Wallets: Map<bigint, Wallet>;

    protected EventHandlers: Map<EventNames, EventHandler[]>;

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
        this.EventHandlers = new Map();

        for(let wallet of wallets) {
            this.Wallets.set(wallet.Id, wallet);
            wallet.AddEventListener('Removed', this.OnWalletRemoved.bind(this));
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
                wallet.AddEventListener('Removed', this.OnWalletRemoved.bind(this));
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

    protected OnWalletRemoved(wallet: Wallet) {
        this.Wallets.delete(wallet.Id);
        this.FireEvent('WalletRemoved', wallet);
    }

    /**
     * Registers an event handler
     * @param event_name Name of an event to handle
     * @param handler The event handler
     */
    public AddEventListener(event_name: EventNames, handler: EventHandler) {
        if(!this.EventHandlers.has(event_name)) {
            this.EventHandlers.set(event_name, []);
        }
        let handlers = this.EventHandlers.get(event_name);
        handlers?.push(handler);
    }

    /**
     * Fires an event
     * @param event_name The name of the event to fire
     * @param wallet The wallet that caused the event
     */
    protected FireEvent(event_name: EventNames, wallet: Wallet) {
        let handlers = this.EventHandlers.get(event_name) ?? [];
        for(let handler of handlers) {
            handler(this, {
                EventName: event_name,
                Wallet: wallet
            });
        }
    }
}