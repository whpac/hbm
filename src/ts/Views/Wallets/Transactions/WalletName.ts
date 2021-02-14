import Currency from '../../../Utils/Currency';
import Component from '../../Common/Component';

export default class WalletName extends Component {
    protected Heading: HTMLHeadingElement;
    protected BalanceElement: HTMLElement;

    public get Text() {
        return this.Heading.textContent ?? '';
    }
    public set Text(value: string) {
        this.Heading.textContent = value;
    }

    public set Balance(value: bigint | undefined) {
        if(value === undefined) {
            this.BalanceElement.textContent = '';
            return;
        }

        this.BalanceElement.textContent = Currency.Format(value);

        if(value < 0) this.BalanceElement.classList.add('negative');
        else this.BalanceElement.classList.remove('negative');
    }

    public constructor(initial_title: string = '') {
        super();

        this.Heading = document.createElement('h2');
        this.Heading.classList.add('pane-heading');
        this.Heading.textContent = initial_title;

        this.BalanceElement = document.createElement('span');
        this.BalanceElement.classList.add('balance');
        this.BalanceElement.textContent = '';
    }

    protected Render(): HTMLElement {
        let wrapper = document.createElement('div');
        wrapper.classList.add('pane-heading-wrapper');

        wrapper.appendChild(this.Heading);
        wrapper.appendChild(this.BalanceElement);

        return wrapper;
    }
}