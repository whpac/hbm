import Component from './Component';

export default class LoadingCircle extends Component {

    protected Render(): HTMLElement {
        let wheel = document.createElement('div');
        wheel.classList.add('lds-ripple');
        wheel.appendChild(document.createElement('div'));
        wheel.appendChild(document.createElement('div'));

        let wheel_wrapper = document.createElement('div');
        wheel_wrapper.classList.add('lds-ripple-wrapper');
        wheel_wrapper.appendChild(wheel);
        return wheel_wrapper;
    }
}