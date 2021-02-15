import Icon from '../Icon';
import MenuStripItem from './MenuStripItem';

export default class MenuButton extends MenuStripItem {
    protected CaptionNode: Text;
    protected Icon: Icon | undefined;
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
        if(options.IconName !== undefined) {
            this.Icon = new Icon(options.IconName);
        }
        this.ToolTip = options.ToolTip;
    }

    protected Render(): HTMLElement {
        let li = super.Render();
        let button = document.createElement('button');
        if(this.Icon !== undefined) {
            button.appendChild(this.Icon.GetElement());
        }
        button.appendChild(this.CaptionNode);

        li.classList.add('menu-strip-button');
        li.appendChild(button);
        if(this.ToolTip !== undefined) li.title = this.ToolTip;
        return li;
    }
}

export interface MenuButtonOptions {
    ToolTip?: string;
    IconName?: string;
}