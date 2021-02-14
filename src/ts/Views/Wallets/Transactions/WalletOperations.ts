import Component from '../../Common/Component';

export default class WalletOperations extends Component {

    protected Render(): HTMLElement {
        let div = document.createElement('div');
        div.classList.add('menu-strip');

        let filter_btn = document.createElement('button');
        filter_btn.textContent = 'Filter';
        div.appendChild(filter_btn);

        div.appendChild(document.createTextNode('|'));

        let new_transaction_btn = document.createElement('button');
        new_transaction_btn.textContent = 'New transaction';
        div.appendChild(new_transaction_btn);

        div.appendChild(document.createTextNode('|'));

        let edit_btn = document.createElement('button');
        edit_btn.textContent = 'Edit';
        div.appendChild(edit_btn);

        let remove_btn = document.createElement('button');
        remove_btn.textContent = 'Remove';
        div.appendChild(remove_btn);

        return div;
    }
}