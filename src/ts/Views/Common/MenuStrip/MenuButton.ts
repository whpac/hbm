import Icon from '../Icon';
import { DropdownDirection } from './DropdownDirection';
import MenuStripItem from './MenuStripItem';

export default class MenuButton extends MenuStripItem {
    protected CaptionNode: Text;
    protected Icon: Icon;
    protected DropdownIcon: Icon;
    protected ToolTip: string | undefined;

    public get Text() {
        return this.CaptionNode.textContent ?? '';
    }
    public set Text(value: string) {
        this.CaptionNode.textContent = value;
    }

    public constructor(text: string, options: MenuButtonOptions = {}) {
        super();

        this.CaptionNode = document.createTextNode(text);
        this.Icon = new Icon(options.IconName ?? '', 'command-icon');
        this.DropdownIcon = new Icon('', 'dropdown-icon');
        this.ToolTip = options.ToolTip;

        this.OnIconRequirementChange();
        this.OnDropdownDirectionChange();
    }

    protected Render(): HTMLElement {
        let li = super.Render();
        let button = document.createElement('button');
        button.appendChild(this.Icon.GetElement());
        button.appendChild(this.CaptionNode);
        button.appendChild(this.DropdownIcon.GetElement());
        button.addEventListener('click',
            (() => this.FireEvent('Click')).bind(this)
        );

        li.classList.add('menu-strip-button');
        li.appendChild(button);
        if(this.ToolTip !== undefined) li.title = this.ToolTip;
        return li;
    }

    protected OnIconRequirementChange() {
        super.OnIconRequirementChange();

        if(this.Icon.IconName === '' && !this.IconSpaceRequired) {
            this.Icon.Hide();
        } else {
            this.Icon.Unhide();
        }
    }

    protected OnDropdownDirectionChange() {
        super.OnDropdownDirectionChange();

        switch(this.DropdownDirection) {
            case DropdownDirection.NO_DROPDOWN:
                this.DropdownIcon.IconName = '';
                this.DropdownIcon.Hide();
                break;
            case DropdownDirection.HORIZONTAL:
                this.DropdownIcon.IconName = 'chevron-forward-outline';
                this.DropdownIcon.Unhide();
                break;
            case DropdownDirection.VERTICAL:
                this.DropdownIcon.IconName = 'chevron-down-outline';
                this.DropdownIcon.Unhide();
                break;
        }
    }
};

export interface MenuButtonOptions {
    ToolTip?: string;
    IconName?: string;
}