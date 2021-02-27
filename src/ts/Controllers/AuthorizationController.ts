import App from '../App/App';
import AuthManager from '../Authorization/AuthManager';
import Command from '../Dispatcher/Command';
import RequestExecutor from '../Dispatcher/RequestExecutor';
import LogInPage from '../Views/Authorization/LogInPage';
import Component from '../Views/Common/Component';
import ComponentEvent from '../Views/Common/ComponentEvent';
import PagePresenter from '../Views/Presentation/PagePresenter';

type LoginRequestedData = {
    Login: string;
    Password: string;
};

export default class AuthoriztionController implements RequestExecutor {
    protected LogInPage: LogInPage | undefined;

    async Execute(command: Command): Promise<void> {
        this.LogInPage = new LogInPage();
        this.LogInPage.AddEventListener('LoginRequested', this.OnLoginRequested.bind(this));

        await PagePresenter.DisplayPage(this.LogInPage);
    }

    protected async OnLoginRequested(sender: Component<string>, e: ComponentEvent<LoginRequestedData>) {
        if(this.LogInPage === undefined) return;
        if(e.Data === undefined) return;

        let result = await AuthManager.TryToLogIn(e.Data.Login, e.Data.Password);
        if(!result) {
            this.LogInPage.DisplayAuthenticationError('Unable to log in');
            return;
        }
        this.LogInPage.HideLoadingIndicator();
        App.GetInstance().MakeRequest('');
    }
}