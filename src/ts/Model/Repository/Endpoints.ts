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
}