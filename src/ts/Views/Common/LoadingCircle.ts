import Component from './Component';

export default class LoadingCircle extends Component {

    protected Render(): HTMLElement {
        let span = document.createElement('span');
        span.innerText = 'Loading...';
        return span;
    }
}