import Component from './Component';
import { StatePresenter } from './StateWrapper';

export default class ErrorPresenter extends StatePresenter {
    protected ErrorText: Text;

    public constructor() {
        super();

        this.ErrorText = document.createTextNode('');
    }

    public PassComponent(component: Component<string>): void {
        this.ErrorText.textContent = component.ErrorMessage;
    }

    protected Render(): HTMLElement {
        let wrapper = document.createElement('div');
        wrapper.classList.add('component-error-wrapper');
        wrapper.appendChild(this.ErrorText);
        return wrapper;
    }
}