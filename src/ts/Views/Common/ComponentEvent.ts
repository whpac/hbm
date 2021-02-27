export default class ComponentEvent<T = any> {
    public readonly Name: string;
    public readonly Data: T | undefined;

    public constructor(event_name: string, data?: T) {
        this.Name = event_name;
        this.Data = data;
    }
}