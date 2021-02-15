import Component from '../Component';

export default class MenuStripItem<TEvent extends string = ""> extends Component<TEvent> {

    protected Render(): HTMLElement {
        let li = document.createElement('li');
        return li;
    }
}