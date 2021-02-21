import Component from '../Component';

export default class DialogButton extends Component<'Click'> {
    protected ButtonElement: HTMLButtonElement;

    /** Gets or sets the text displayed on the button */
    public get Caption() {
        return this.ButtonElement.textContent ?? '';
    }
    public set Caption(value: string) {
        this.ButtonElement.textContent = value;
    }

    /** Gets or sets whether the button is enabled */
    public get Enabled() {
        return !this.ButtonElement.disabled;
    }
    public set Enabled(value: boolean) {
        this.ButtonElement.disabled = !value;
    }

    public constructor(caption: string, is_primary: boolean = false) {
        super();

        this.ButtonElement = document.createElement('button');
        this.ButtonElement.addEventListener('click', this.OnClick.bind(this));
        this.ButtonElement.textContent = caption;

        if(is_primary) this.ButtonElement.classList.add('primary');
    }

    protected Render(): HTMLElement {
        return this.ButtonElement;
    }

    protected OnClick() {
        this.FireEvent('Click');
    }
}