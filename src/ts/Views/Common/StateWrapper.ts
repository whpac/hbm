import Component from './Component';
import { ComponentState } from './ComponentState';

/**
 * Component that swaps the content according to the wrapped component state
 */
export default class StateWrapper extends Component {
    protected ActualComponent: Component<string>;
    protected Components: Map<ComponentState, Component<string>>;
    protected CssClasses: string[];

    /**
     * Creates a wrapper around the component and swaps it with special ones
     * to present its different states.
     * @param component The component being wrapped
     * @param css CSS classes for the wrapper
     */
    public constructor(component: Component<string>, ...css: string[]) {
        super();

        component.AddEventListener('StateChanged', this.OnComponentStateChanged.bind(this));
        this.ActualComponent = component;
        this.Components = new Map();
        this.Components.set(ComponentState.READY, component);

        this.CssClasses = css;
    }

    public SetStatePresenter(state: ComponentState, presenter: Component<string>) {
        this.Components.set(state, presenter);
    }

    protected Render(): HTMLElement {
        let wrapper = document.createElement('div');
        wrapper.classList.add('conditional-state-wrapper');
        wrapper.appendChild(this.GetApprorpiateContentElement());
        wrapper.classList.add(...this.CssClasses);
        return wrapper;
    }

    protected OnComponentStateChanged() {
        let self = this.GetElement();
        while(self.firstChild !== null) {
            self.removeChild(self.lastChild!);
        }

        self.appendChild(this.GetApprorpiateContentElement());
    }

    protected GetApprorpiateContentElement(): HTMLElement {
        let presenter = this.Components.get(this.ActualComponent.State);
        if(presenter === undefined) {
            presenter = this.ActualComponent;
        }
        return presenter.GetElement();
    }
}