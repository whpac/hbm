import Component from '../Component';
import MenuStripItem from './MenuStripItem';

export default class MenuStrip extends Component {
    private MainMenuElement: HTMLUListElement;
    private SecondaryMenuElement: HTMLUListElement;

    public constructor() {
        super();

        this.MainMenuElement = document.createElement('ul');
        this.MainMenuElement.classList.add('main');
        this.SecondaryMenuElement = document.createElement('ul');
        this.SecondaryMenuElement.classList.add('secondary');
    }

    protected Render(): HTMLElement {
        let wrapper = document.createElement('div');
        wrapper.classList.add('menu-strip');
        wrapper.appendChild(this.MainMenuElement);
        wrapper.appendChild(this.SecondaryMenuElement);
        return wrapper;
    }

    public AddMenuItem(item: MenuStripItem) {
        this.MainMenuElement.appendChild(item.GetElement());
    }

    public AddSecondaryMenuItem(item: MenuStripItem) {
        this.SecondaryMenuElement.appendChild(item.GetElement());
    }
}