import TransactionCategory from '../../Model/TransactionCategory';
import { TransactionType } from '../../Model/TransactionType';

export default class TransactionDto {
    public CategoryId: bigint;
    public CategoryName: string;
    public CategoryDescription: string;
    public IsExpense: boolean;

    public constructor(
        public readonly Id: bigint | undefined,
        public Name: string,
        public Description: string,
        public Price: bigint,
        public DateTime: Date,
        category: TransactionCategory
    ) {
        this.CategoryId = category.Id;
        this.CategoryName = category.Name;
        this.CategoryDescription = category.Description;
        this.IsExpense = category.IsExpense;
    }
}