export default class User {
    public readonly Name: string;
    public readonly Email: string;
    public readonly FavouriteWalletId: bigint;
    public readonly IsAuthorized: boolean;

    public constructor(name: string, email: string, favourite_wallet_id: bigint, is_authorized: boolean) {
        this.Name = name;
        this.Email = email;
        this.FavouriteWalletId = favourite_wallet_id;
        this.IsAuthorized = is_authorized;
    }
}