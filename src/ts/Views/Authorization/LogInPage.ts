import ComponentEvent from '../Common/ComponentEvent';
import { ComponentState } from '../Common/ComponentState';
import LoadingCircle from '../Common/LoadingCircle';
import StateWrapper from '../Common/StateWrapper';
import PageComponent from '../Presentation/PageComponent';
import LogInForm from './LogInForm/LogInForm';

export default class LogInPage extends PageComponent<'LoginRequested'> {
    protected LogInForm: LogInForm;

    public constructor() {
        super();

        this.LogInForm = new LogInForm();
    }

    public Load(): void | Promise<void> { }
    public Unload(): void | Promise<void> { }
    public GetTitle(): string {
        return 'Log in';
    }

    public DisplayAuthenticationError(error_text: string) {
        this.LogInForm.AuthenticationFailed(error_text);
    }

    public HideLoadingIndicator() {
        this.LogInForm.HideLoadingIndicator();
    }

    protected Render(): HTMLElement {
        let elem = document.createElement('main');
        elem.classList.add('login-page');

        this.LogInForm.AddEventListener('LoginRequested', ((s: any, d: ComponentEvent) => this.FireEvent('LoginRequested', d.Data)).bind(this));
        let wrapper = new StateWrapper(this.LogInForm, 'login-form');
        wrapper.SetStatePresenter(ComponentState.LOADING, new LoadingCircle());
        elem.appendChild(wrapper.GetElement());

        return elem;
    }
}