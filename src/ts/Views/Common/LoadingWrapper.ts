import Component from './Component';
import { ComponentState } from './ComponentState';

export default class LoadingWrapper extends Component {
    protected LoadingIndicator: Component;
    protected ActualComponent: Component;
    protected CssClasses: string[];

    public constructor(component: Component, loading_indicator: Component, ...css: string[]) {
        super();

        this.ActualComponent = component;
        this.LoadingIndicator = loading_indicator;
        this.CssClasses = css;

        this.ActualComponent.AddEventListener('StateChanged', this.OnComponentStateChanged.bind(this));
    }

    protected Render(): HTMLElement {
        let wrapper = document.createElement('div');
        wrapper.classList.add('conditional-loading-wrapper');
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
        if(this.ActualComponent.State == ComponentState.READY) {
            return this.ActualComponent.GetElement();
        } else {
            return this.LoadingIndicator.GetElement();
        }
    }
}