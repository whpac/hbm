import Component from './Component';
import { ComponentState } from './ComponentState';
import ListViewItem from './ListViewItem';

export default class ListView<TItem extends ListViewItem = ListViewItem, TEvent extends string = ""> extends Component<'SelectionChanged' | TEvent> {
    private ListElement: HTMLUListElement;
    private _IsWaitingForData: boolean = false;
    protected Items: TItem[];
    protected SelectedItem: TItem | undefined;

    /** Gets or sets whether the ListView is waiting for data. This affects the component state */
    public get IsWaitingForData() {
        return this._IsWaitingForData;
    }
    public set IsWaitingForData(value: boolean) {
        this._IsWaitingForData = value;
        this.SetState(value ? ComponentState.LOADING : ComponentState.READY);
    }

    public constructor() {
        super();

        this.ListElement = document.createElement('ul');
        this.ListElement.classList.add('list-view');

        this.Items = [];
        this.SetState(ComponentState.READY);
    }

    protected Render(): HTMLElement {
        return this.ListElement;
    }

    /**
     * Adds an item to the ListView
     * @param item An item to add
     */
    public AddItem(item: TItem): void {
        this.Items.push(item);
        item.AddEventListener('Click', this.OnItemClicked.bind(this));
        this.ListElement.appendChild(item.GetElement());
    }

    /**
     * Returns the selected item or undefined
     */
    public GetSelectedItem(): TItem | undefined {
        return this.SelectedItem;
    }

    /**
     * Marks an item at the given index as selected. If out of range, deselects everything
     * @param index Index of an item to select
     */
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

    /**
     * Removes all items from the ListView
     */
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