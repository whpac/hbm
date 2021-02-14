export default class TransactionDto {

    public constructor(
        public readonly Id: bigint,
        public Name: string,
        public Description: string,
        public Price: bigint,
        public DateTime: Date
    ) { }
}