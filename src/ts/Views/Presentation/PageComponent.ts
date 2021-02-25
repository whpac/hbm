import Component from '../Common/Component';
import Page from './Page';

export default abstract class PageComponent<T extends string = ''> extends Component<T> implements Page {

    public abstract Load(): void | Promise<void>;
    public abstract Unload(): void | Promise<void>;

    public abstract GetTitle(): string;
}