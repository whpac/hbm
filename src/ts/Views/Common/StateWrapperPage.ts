import Page from '../Presentation/Page';
import PageComponent from '../Presentation/PageComponent';
import StateWrapper from './StateWrapper';

export default class StateWrapperPage extends StateWrapper implements Page {
    protected ActualComponent!: PageComponent<string>;

    public constructor(component: PageComponent<string>, ...css: string[]) {
        super(component, ...css);
    }

    Load(): void | Promise<void> {
        return this.ActualComponent.Load();
    }
    Unload(): void | Promise<void> {
        return this.ActualComponent.Unload();
    }
    GetTitle(): string {
        return this.ActualComponent.GetTitle();
    }
}