import Component from '../Component';
import Icon from '../Icon';
import DialogButton from './DialogButton';

type DialogEvents = 'Closed' | 'Shown';

export default class Dialog<TEvent extends string = ""> extends Component<TEvent | DialogEvents> {
    private TitleElement: HTMLElement;
    private CloseButton: HTMLButtonElement;
    private ContentWrapper: HTMLElement;
    private ButtonsWrapper: HTMLElement;
    private _IsCloseButtonVisible: boolean = true;

    protected get IsCloseButtonVisible() {
        return this._IsCloseButtonVisible;
    }
    protected set IsCloseButtonVisible(value: boolean) {
        this._IsCloseButtonVisible = value;

        if(value) this.CloseButton.style.display = '';
        else this.CloseButton.style.display = 'none';
    }

    public constructor() {
        super();

        this.TitleElement = document.createElement('h2');
        this.TitleElement.classList.add('dialog-title');

        this.CloseButton = document.createElement('button');
        this.CloseButton.classList.add('dialog-close');
        this.CloseButton.title = 'Close this window';
        this.CloseButton.appendChild(new Icon('close-outline').GetElement());
        this.CloseButton.addEventListener('click', this.Hide.bind(this));

        this.ContentWrapper = document.createElement('div');
        this.ContentWrapper.classList.add('dialog-content');

        this.ButtonsWrapper = document.createElement('div');
        this.ButtonsWrapper.classList.add('dialog-buttons');
    }

    protected SetTitle(title: string | Node) {
        if(typeof title === 'string') {
            title = document.createTextNode(title);
        }

        while(this.TitleElement.firstChild !== null) {
            this.TitleElement.removeChild(this.TitleElement.lastChild!);
        }

        this.TitleElement.appendChild(title);
    }

    protected AddContent(elem: HTMLElement) {
        this.ContentWrapper.appendChild(elem);
    }

    protected AddButton(button: DialogButton) {
        this.ButtonsWrapper.appendChild(button.GetElement());
    }

    protected Render(): HTMLElement {
        let dialog_root = document.createElement('div');
        dialog_root.classList.add('dialog-root');

        let heading_wrapper = document.createElement('div');
        heading_wrapper.classList.add('dialog-heading');
        heading_wrapper.appendChild(this.TitleElement);
        heading_wrapper.appendChild(this.CloseButton);
        dialog_root.appendChild(heading_wrapper);

        dialog_root.appendChild(this.ContentWrapper);
        dialog_root.appendChild(this.ButtonsWrapper);
        return dialog_root;
    }

    public Hide() {
        super.Hide();
        this.FireEvent('Closed');
    }

    public Unhide() {
        super.Unhide();
        this.FireEvent('Shown');
    }
}