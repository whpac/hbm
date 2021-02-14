import { TransactionType } from './TransactionType';

export default class TransactionCategory {
    public readonly Id: bigint;
    public Name: string;
    public Description: string;
    public Type: TransactionType;

    public constructor(id: bigint, name: string, description: string, type: TransactionType) {
        this.Id = id;
        this.Name = name;
        this.Description = description;
        this.Type = type;
    }
}