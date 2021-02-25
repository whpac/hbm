export interface RawWallet {
    /** The wallet identifier */
    readonly Id: bigint | undefined;
    /** The wallet name */
    Name: string;
    /** The current balance */
    Balance: bigint;
}