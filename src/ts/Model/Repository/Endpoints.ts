export default class Endpoints {

    public static GetBaseUri(): string {
        return 'http://localhost/hbm/proxy';
    }

    public static GetWalletsUri(): string {
        return this.GetBaseUri() + '/wallet';
    }

    public static GetWalletUri(wallet_id: bigint): string {
        return this.GetWalletsUri() + `/${wallet_id}`;
    }

    public static GetTransactionsUri(wallet_id: bigint): string {
        return this.GetWalletUri(wallet_id) + '/transactions';
    }

    public static GetTransactionUri(transaction_id: bigint, wallet_id: bigint): string {
        return this.GetTransactionsUri(wallet_id) + `/${transaction_id}`;
    }

    public static GetCreateTransactionUri(wallet_id: bigint, category_id: bigint): string {
        return this.GetWalletUri(wallet_id) + `/category/${category_id}/transaction/add`;
    }
}