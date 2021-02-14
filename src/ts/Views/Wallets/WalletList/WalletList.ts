import ListView from '../../Common/ListView';
import WalletListItem from './WalletListItem';

export default class WalletList extends ListView<WalletListItem> {

    public constructor() {
        super();
    }

    protected Render(): HTMLElement {
        let pane = document.createElement('div');
        pane.classList.add('list-pane');

        let pane_heading = document.createElement('h2');
        pane_heading.classList.add('pane-heading');
        pane_heading.textContent = 'Wallets';
        pane.appendChild(pane_heading);

        pane.appendChild(super.Render());

        return pane;
    }
}