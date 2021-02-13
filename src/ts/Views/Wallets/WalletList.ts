import Component from '../Common/Component';
import WalletListItem from './WalletListItem';

export default class WalletList extends Component {
    protected ListElement: HTMLUListElement;

    public constructor() {
        super();

        this.ListElement = document.createElement('ul');
        this.ListElement.classList.add('wallet-list');
    }

    protected Render(): HTMLElement {
        let pane = document.createElement('div');
        pane.classList.add('list-pane');

        let pane_heading = document.createElement('h2');
        pane_heading.classList.add('pane-heading');
        pane_heading.textContent = 'Wallets';
        pane.appendChild(pane_heading);

        pane.appendChild(this.ListElement);

        return pane;
    }

    public AddItem(item: WalletListItem): void {
        this.ListElement.appendChild(item.GetElement());
    }
}