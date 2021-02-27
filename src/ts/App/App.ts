import AuthManager from '../Authorization/AuthManager';
import BasicAuthorizationProvider from '../Authorization/BasicAuthorizationProvider';
import RequestDispatcher from '../Dispatcher/RequestDispatcher';
import Http from '../Network/Http';
import BrowserAdapter from '../Views/Presentation/BrowserAdapter';
import DialogPresenter from '../Views/Presentation/DialogPresenter';
import PagePresenter from '../Views/Presentation/PagePresenter';
import ExecutorStorage from './ExecutorStorage';

export default class App {
    protected RequestDispatcher: RequestDispatcher;
    protected static Singleton: App | undefined;

    public static GetInstance(): App {
        if(this.Singleton === undefined) {
            this.Singleton = new App();
        }
        return this.Singleton;
    }

    protected constructor() {
        let content_wrapper = document.getElementById('site-content');
        if(content_wrapper === null) {
            throw 'Unable to retrieve the document root.';
        }
        let browser_adapter = new BrowserAdapter(content_wrapper);
        PagePresenter.SetDisplayAdapter(browser_adapter);

        let dialog_space = document.getElementById('dialog-space');
        if(dialog_space === null) {
            throw 'Unable to retrieve the dialog root.';
        }
        let dialog_adapter = new BrowserAdapter(dialog_space);
        DialogPresenter.SetDisplayAdapter(dialog_adapter);

        Http.SetAuthorizationProvider(new BasicAuthorizationProvider());

        AuthManager.RestoreToken();

        this.RequestDispatcher = new RequestDispatcher();
        this.RequestDispatcher.SetExecutorStorage(new ExecutorStorage());
    }

    public async MakeRequest(uri: string) {
        await this.RequestDispatcher.Dispatch(uri);
    }
}

function Main() {
    try {
        let app = App.GetInstance();

        let path = document.location.href.substr(document.baseURI.length);
        app.MakeRequest(path);
    } catch(e) {
        alert(e);
    }
}

Main();