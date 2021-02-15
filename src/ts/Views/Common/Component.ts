import { ComponentState } from './ComponentState';

type EventHandler = (sender: Component<string>) => void;
type BasicComponentEvents = 'StateChanged';

export default abstract class Component<Events extends string = ""> {
    private EventListeners: Map<string, EventHandler[]>;
    private Element: HTMLElement | undefined;

    private _State: ComponentState;
    /** The current state of the component */
    public get State(): ComponentState {
        return this._State;
    }

    public constructor() {
        this._State = ComponentState.LOADING;
        this.EventListeners = new Map();
    }

    /**
     * Registers an event handler
     * @param event_name Name of the event to handle
     * @param handler The function to be called upon an event
     */
    public AddEventListener(event_name: BasicComponentEvents | Events, handler: EventHandler) {
        if(!this.EventListeners.has(event_name)) this.EventListeners.set(event_name, []);
        let handler_array = this.EventListeners.get(event_name) ?? [];
        handler_array.push(handler);
    }

    /**
     * Returns an HTML representation of the component.
     * Doesn't invoke any redrawing.
     */
    public GetElement(): HTMLElement {
        if(this.Element === undefined) this.Element = this.Render();
        return this.Element;
    }

    /**
     * Fires an event
     * @param event_name Name of an event to fire
     */
    protected FireEvent(event_name: BasicComponentEvents | Events) {
        let handlers = this.EventListeners.get(event_name) ?? [];
        for(let handler of handlers) {
            if(typeof handler !== 'function') continue;
            handler(this);
        }
    }

    /**
     * Changes state of the component
     * @param new_state New state of the component
     */
    protected SetState(new_state: ComponentState) {
        this._State = new_state;
        this.FireEvent('StateChanged');
    }

    /**
     * Hides the component
     */
    public Hide() {
        this.GetElement().style.display = 'none';
    }

    /**
     * Displays the component
     */
    public Unhide() {
        this.GetElement().style.display = '';
    }

    /**
     * Renders the component and returns its HTML representation
     */
    protected abstract Render(): HTMLElement;
}