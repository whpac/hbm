import Component from './Component';

export default class ListViewItem<TEvent extends string = ""> extends Component<TEvent | 'Click'> {
    private Button: HTMLButtonElement;
    private _IsSelected: boolean;

    /** Whether the item is selected */
    public get IsSelected() {
        return this._IsSelected;
    }
    public set IsSelected(value: boolean) {
        this._IsSelected = value;
        if(value) this.Button.classList.add('selected');
        else this.Button.classList.remove('selected');
    }

    public constructor(content: HTMLElement | HTMLElement[]) {
        super();

        this._IsSelected = false;

        this.Button = document.createElement('button');
        this.Button.type = 'button';
        this.Button.addEventListener('click', this.OnButtonPressed.bind(this));

        if(!Array.isArray(content)) {
            content = [content];
        }

        for(let element of content) {
            this.Button.appendChild(element);
        }
    }

    protected Render(): HTMLElement {
        let li = document.createElement('li');
        li.classList.add('list-view-item');
        li.appendChild(this.Button);
        return li;
    }

    private OnButtonPressed() {
        this.FireEvent('Click');
    }
}