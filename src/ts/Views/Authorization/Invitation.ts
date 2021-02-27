import Component from '../Common/Component';

export default class Invitation extends Component {

    protected Render(): HTMLElement {
        let div = document.createElement('div');
        div.classList.add('invitation');

        let title = document.createElement('h2');
        title.textContent = 'Hello!';
        div.appendChild(title);

        let paragraph = document.createElement('p');
        paragraph.textContent = `Welcome to the Home Budget Management system! Here you can
            note all your expenses and income. The HBM provides you with six different transaction
            categories. Not only can you register your spendings and salary but also loans and
            repayments.`;
        div.appendChild(paragraph);

        return div;
    }
}