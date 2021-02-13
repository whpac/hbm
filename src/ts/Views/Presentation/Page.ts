export default interface Page {

    Load(): void | Promise<void>;
    Unload(): void | Promise<void>;

    GetElement(): HTMLElement;
    GetTitle(): string;
}