import BasicAuthorizationProvider from '../Authorization/BasicAuthorizationProvider';
import RequestDispatcher from '../Dispatcher/RequestDispatcher';
import Http from '../Network/Http';
import BrowserAdapter from '../Views/Presentation/BrowserAdapter';
import DialogPresenter from '../Views/Presentation/DialogPresenter';
import PagePresenter from '../Views/Presentation/PagePresenter';
import ExecutorStorage from './ExecutorStorage';

function Main() {
    let path = document.location.href.substr(document.baseURI.length);

    let content_wrapper = document.getElementById('site-content');
    if(content_wrapper === null) {
        alert('Unable to retrieve the document root.');
        return;
    }
    let browser_adapter = new BrowserAdapter(content_wrapper);
    PagePresenter.SetDisplayAdapter(browser_adapter);

    let dialog_space = document.getElementById('dialog-space');
    if(dialog_space === null) {
        alert('Unable to retrieve the dialog root.');
        return;
    }
    let dialog_adapter = new BrowserAdapter(dialog_space);
    DialogPresenter.SetDisplayAdapter(dialog_adapter);

    Http.SetAuthorizationProvider(new BasicAuthorizationProvider());

    let rd = new RequestDispatcher();
    rd.SetExecutorStorage(new ExecutorStorage());
    (async () => {
        await rd.Dispatch(path);
    })();
}

Main();