export default class WalletDto {

    public constructor(
        public Id: bigint,
        public Name: string,
        public Balance: bigint,
        public IsDefault: boolean
    ) { }
}