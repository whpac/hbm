import Component from '../Common/Component';

export default class WalletTransactions extends Component {

    protected Render(): HTMLElement {
        let pane = document.createElement('div');
        pane.classList.add('content-pane');

        let pane_heading = document.createElement('h2');
        pane_heading.classList.add('pane-heading');
        pane_heading.textContent = '[Wallet name]';
        pane.appendChild(pane_heading);

        return pane;
    }
}