import Icon from './Icon';
import Component from './Component';

export default class Button extends Component<'Click'> {
    protected CaptionNode: Text;
    protected Icon: Icon;
    protected ToolTip: string | undefined;
    protected ButtonElement: HTMLButtonElement;

    public get Enabled() {
        return !this.ButtonElement.disabled;
    }
    public set Enabled(value: boolean) {
        this.ButtonElement.disabled = !value;
    }

    public get Text() {
        return this.CaptionNode.textContent ?? '';
    }
    public set Text(value: string) {
        this.CaptionNode.textContent = value;
    }

    public constructor(text: string, options: ButtonOptions = {}) {
        super();

        this.CaptionNode = document.createTextNode(text);
        this.Icon = new Icon(options.IconName ?? '', 'command-icon');
        this.ToolTip = options.ToolTip;
        this.ButtonElement = document.createElement('button');
    }

    protected Render(): HTMLElement {
        this.ButtonElement.appendChild(this.Icon.GetElement());
        this.ButtonElement.appendChild(this.CaptionNode);
        this.ButtonElement.addEventListener('click',
            (() => this.FireEvent('Click')).bind(this)
        );
        if(this.ToolTip !== undefined) this.ButtonElement.title = this.ToolTip;

        return this.ButtonElement;
    }
};

export interface ButtonOptions {
    ToolTip?: string;
    IconName?: string;
}