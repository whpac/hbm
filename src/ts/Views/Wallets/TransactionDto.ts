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

        switch(category.Type) {
            case TransactionType.EXPENSE:
            case TransactionType.LOAN:
            case TransactionType.BORROW_BACK:
                this.IsExpense = true;
                break;
            case TransactionType.REVENUES:
            case TransactionType.BORROW:
            case TransactionType.LOAN_BACK:
                this.IsExpense = false;
                break;
            default:
                this.IsExpense = true;
                break;
        }
    }
}