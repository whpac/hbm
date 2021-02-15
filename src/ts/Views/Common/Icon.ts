import Component from './Component';

export default class Icon extends Component {
    protected IconElement: HTMLIonIconElement;

    public get IconName() {
        return this.IconElement.name;
    }
    public set IconName(value: string) {
        this.IconElement.name = value;
    }

    public constructor(icon_name: string, ...css_classes: string[]) {
        super();

        this.IconElement = document.createElement('ion-icon') as HTMLIonIconElement;
        this.IconElement.classList.add('icon');
        this.IconElement.classList.add(...css_classes);
        this.IconName = icon_name;
    }

    protected Render(): HTMLElement {
        return this.IconElement;
    }
}

interface HTMLIonIconElement extends HTMLElement {
    name: string;
}