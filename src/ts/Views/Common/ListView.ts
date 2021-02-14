import Component from './Component';
import ListViewItem from './ListViewItem';

export default class ListView<TItem extends ListViewItem = ListViewItem, TEvent extends string = ""> extends Component<'SelectionChanged' | TEvent> {
    private ListElement: HTMLUListElement;
    protected Items: TItem[];
    protected SelectedItem: TItem | undefined;

    public constructor() {
        super();

        this.ListElement = document.createElement('ul');
        this.ListElement.classList.add('list-view');

        this.Items = [];
    }

    protected Render(): HTMLElement {
        return this.ListElement;
    }

    public AddItem(item: TItem): void {
        this.Items.push(item);
        item.AddEventListener('Click', this.OnItemClicked.bind(this));
        this.ListElement.appendChild(item.GetElement());
    }

    public GetSelectedItem(): TItem | undefined {
        return this.SelectedItem;
    }

    public SetSelectedIndex(index: number): void {
        if(this.SelectedItem !== undefined) {
            this.SelectedItem.IsSelected = false;
        }

        if(index < 0 || index >= this.Items.length) {
            this.SelectedItem = undefined;
        } else {
            this.SelectedItem = this.Items[index];
            this.SelectedItem.IsSelected = true;
        }

        this.FireEvent('SelectionChanged');
    }

    public RemoveAllItems(): void {
        this.Items = [];
        this.SelectedItem = undefined;

        while(this.ListElement.firstChild !== null) {
            this.ListElement.removeChild(this.ListElement.lastChild!);
        }
    }

    private OnItemClicked(component: Component) {
        if(this.SelectedItem === component) return;
        if(this.SelectedItem !== undefined) {
            this.SelectedItem.IsSelected = false;
        }

        this.SelectedItem = component as TItem;
        this.SelectedItem.IsSelected = true;

        this.FireEvent('SelectionChanged');
    }
}