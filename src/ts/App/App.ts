import RequestDispatcher from '../Dispatcher/RequestDispatcher';
import ExecutorStorage from './ExecutorStorage';

let path = document.location.href.substr(document.baseURI.length);

let rd = new RequestDispatcher();
rd.SetExecutorStorage(new ExecutorStorage());
rd.Dispatch(path);