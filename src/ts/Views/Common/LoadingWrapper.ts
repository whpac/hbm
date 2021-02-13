import Component from './Component';
import { ComponentState } from './ComponentState';

export default class LoadingWrapper extends Component {
    protected LoadingIndicator: Component;
    protected ActualComponent: Component;

    public constructor(component: Component, loading_indicator: Component) {
        super();

        this.ActualComponent = component;
        this.LoadingIndicator = loading_indicator;

        this.ActualComponent.AddEventListener('StateChanged', this.OnComponentStateChanged.bind(this));
    }

    protected Render(): HTMLElement {
        let wrapper = document.createElement('div');
        wrapper.appendChild(this.LoadingIndicator.GetElement());
        return wrapper;
    }

    protected OnComponentStateChanged() {
        let self = this.GetElement();
        while(self.firstChild !== null) {
            self.removeChild(self.lastChild!);
        }

        if(this.ActualComponent.State == ComponentState.READY) {
            self.appendChild(this.ActualComponent.GetElement());
        } else {
            self.appendChild(this.LoadingIndicator.GetElement());
        }
    }
}