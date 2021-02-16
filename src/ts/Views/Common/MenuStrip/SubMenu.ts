import { DropdownDirection } from './DropdownDirection';
import MenuButton from './MenuButton';
import MenuStripItem from './MenuStripItem';

export default class SubMenu extends MenuStripItem {
    protected MenuHeader: MenuButton;
    protected MenuElement: HTMLUListElement;

    public constructor(header: MenuButton) {
        super();

        this.MenuHeader = header;
        this.MenuElement = document.createElement('ul');
        this.MenuElement.classList.add('menu', 'hidden');

        this.MenuHeader.AddEventListener('Click', this.Toggle.bind(this));

        document.addEventListener('click', this.HandleDocumentClick.bind(this));
        window.addEventListener('resize', this.CalculatePosition.bind(this));

        this.AddEventListener('DropdownDirectionChanged', this.OnDropdownDirectionChange.bind(this));
        this.AddEventListener('IconRequirementChanged', this.OnIconRequirementChange.bind(this));
    }

    protected Render(): HTMLElement {
        let li = this.MenuHeader.GetElement();
        li.classList.add('submenu');
        li.appendChild(this.MenuElement);
        return li;
    }

    public AddMenuItem(item: MenuStripItem<string>) {
        this.MenuElement.appendChild(item.GetElement());
        item.AddEventListener('Click', this.Hide.bind(this));
        item.IconSpaceRequired = true;

        if(item instanceof SubMenu) {
            item.DropdownDirection = DropdownDirection.HORIZONTAL;
        }
    }

    public Unhide() {
        this.MenuElement.classList.remove('hidden');
        this.CalculatePosition();
    }

    public Hide() {
        this.MenuElement.classList.add('hidden');
    }

    public Toggle() {
        this.MenuElement.classList.toggle('hidden');
        this.CalculatePosition();
    }

    protected CalculatePosition() {
        let header_rect = this.MenuHeader.GetElement().getBoundingClientRect();
        let menu_width = this.MenuElement.clientWidth;
        let window_width = Math.max(document.documentElement.clientWidth ?? 0, window.innerWidth ?? 0);

        // If the menu is going to be too close to the right edge, move it to the left
        if(header_rect.left + menu_width > window_width - 100 && header_rect.left > window_width / 2) {
            this.MenuElement.style.left = (header_rect.right - menu_width) + 'px';
        } else {
            this.MenuElement.style.left = header_rect.left + 'px';
        }
    }

    protected HandleDocumentClick(e: MouseEvent) {
        let clicked_element = e.target as (Node | null);

        while(clicked_element !== null) {
            // This is a click inside. Do nothing, just return.
            if(clicked_element == this.MenuHeader.GetElement()) return;

            // Go up the DOM
            clicked_element = clicked_element.parentNode;
        }

        this.Hide();
    }

    protected OnIconRequirementChange() {
        this.MenuHeader.IconSpaceRequired = this.IconSpaceRequired;
    }

    protected OnDropdownDirectionChange() {
        this.MenuHeader.DropdownDirection = this.DropdownDirection;
    }
}