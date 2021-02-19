import { TransactionType } from './TransactionType';

export default class TransactionCategory {
    public readonly Id: bigint;
    public Name: string;
    public Description: string;
    public Type: TransactionType;

    public get IsExpense(): boolean {
        switch(this.Type) {
            case TransactionType.EXPENSE:
            case TransactionType.LOAN:
            case TransactionType.BORROW_BACK:
                return true;
            case TransactionType.REVENUES:
            case TransactionType.BORROW:
            case TransactionType.LOAN_BACK:
                return false;
            default:
                return true;
        }
    }

    public constructor(id: bigint, name: string, description: string, type: TransactionType) {
        this.Id = id;
        this.Name = name;
        this.Description = description;
        this.Type = type;
    }
}