import RequestDispatcher from '../Dispatcher/RequestDispatcher';
import BrowserAdapter from '../Views/Presentation/BrowserAdapter';
import Presenter from '../Views/Presentation/Presenter';
import ExecutorStorage from './ExecutorStorage';

function Main() {
    let path = document.location.href.substr(document.baseURI.length);

    let content_wrapper = document.getElementById('site-content');
    if(content_wrapper === null) {
        alert('Unable to retrieve the document root.');
        return;
    }
    let browser_adapter = new BrowserAdapter(content_wrapper);
    Presenter.SetDisplayAdapter(browser_adapter);

    let rd = new RequestDispatcher();
    rd.SetExecutorStorage(new ExecutorStorage());
    (async () => {
        await rd.Dispatch(path);
    })();
}

Main();