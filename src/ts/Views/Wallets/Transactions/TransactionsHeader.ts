import Component from '../../Common/Component';

export default class TransactionsHeader extends Component {
    public readonly Title: Component;
    public readonly MenuStrip: Component;

    public constructor(title: Component, menu_strip: Component) {
        super();

        this.Title = title;
        this.MenuStrip = menu_strip;
    }

    protected Render(): HTMLElement {
        let wrapper = document.createElement('div');
        wrapper.classList.add('transactions-header');

        wrapper.appendChild(this.Title.GetElement());
        wrapper.appendChild(this.MenuStrip.GetElement());

        return wrapper;
    }
}