export default class ComponentEvent {
    public readonly Name: string;
    public readonly Data: any;

    public constructor(event_name: string, data?: any) {
        this.Name = event_name;
        this.Data = data;
    }
}