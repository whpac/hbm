import Wallet from '../Wallet';

export default class WalletRepository {

    /**
     * Returns a list of all wallets belonging to
     * the current user
     */
    public static GetAllWallets(): Wallet[] {
        return [];
    }

    /**
     * Loads a wallet with the given identifier
     * @param id Identifier of a wallet
     */
    public static GetWalletById(id: bigint): Wallet | undefined {
        return undefined;
    }
}