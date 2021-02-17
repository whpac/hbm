import Component from '../Component';
import { DropdownDirection } from './DropdownDirection';
import MenuStripItem from './MenuStripItem';
import SubMenu from './SubMenu';

export default class MenuStrip<TEvents extends string = ''> extends Component<TEvents> {
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

    public AddMenuItem(item: MenuStripItem<string>) {
        this.MainMenuElement.appendChild(item.GetElement());

        if(item instanceof SubMenu) {
            item.DropdownDirection = DropdownDirection.VERTICAL;
        }
    }

    public AddSecondaryMenuItem(item: MenuStripItem<string>) {
        this.SecondaryMenuElement.appendChild(item.GetElement());

        if(item instanceof SubMenu) {
            item.DropdownDirection = DropdownDirection.VERTICAL;
        }
    }
}