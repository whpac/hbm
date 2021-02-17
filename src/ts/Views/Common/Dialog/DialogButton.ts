import Component from '../Component';

export default class DialogButton extends Component {
    protected ButtonElement: HTMLButtonElement;

    /** Gets or sets the text displayed on the button */
    public get Caption() {
        return this.ButtonElement.textContent ?? '';
    }
    public set Caption(value: string) {
        this.ButtonElement.textContent = value;
    }

    public constructor(caption: string, is_primary: boolean = false) {
        super();

        this.ButtonElement = document.createElement('button');
        this.ButtonElement.textContent = caption;

        if(is_primary) this.ButtonElement.classList.add('primary');
    }

    protected Render(): HTMLElement {
        return this.ButtonElement;
    }
}