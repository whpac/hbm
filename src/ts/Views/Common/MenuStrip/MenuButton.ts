import Icon from '../Icon';
import { DropdownDirection } from './DropdownDirection';
import MenuStripItem from './MenuStripItem';

export default class MenuButton extends MenuStripItem {
    protected CaptionNode: Text;
    protected Icon: Icon;
    protected DropdownIcon: Icon;
    protected ToolTip: string | undefined;
    protected ButtonElement: HTMLButtonElement;

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
        this.ButtonElement = document.createElement('button');

        this.AddEventListener('DropdownDirectionChanged', this.OnDropdownDirectionChange.bind(this));
        this.OnDropdownDirectionChange();
        this.AddEventListener('EnabledChanged', this.OnEnabledChange.bind(this));
        this.OnEnabledChange();
        this.AddEventListener('IconRequirementChanged', this.OnIconRequirementChange.bind(this));
        this.OnIconRequirementChange();
    }

    protected Render(): HTMLElement {
        let li = super.Render();
        this.ButtonElement.appendChild(this.Icon.GetElement());
        this.ButtonElement.appendChild(this.CaptionNode);
        this.ButtonElement.appendChild(this.DropdownIcon.GetElement());
        this.ButtonElement.addEventListener('click',
            (() => this.FireEvent('Click')).bind(this)
        );

        li.classList.add('menu-strip-button');
        li.appendChild(this.ButtonElement);
        if(this.ToolTip !== undefined) li.title = this.ToolTip;
        return li;
    }

    protected OnIconRequirementChange() {
        if(this.Icon.IconName === '' && !this.IconSpaceRequired) {
            this.Icon.Hide();
        } else {
            this.Icon.Unhide();
        }
    }

    protected OnDropdownDirectionChange() {
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

    protected OnEnabledChange() {
        this.ButtonElement.disabled = !this.Enabled;
    }
};

export interface MenuButtonOptions {
    ToolTip?: string;
    IconName?: string;
}