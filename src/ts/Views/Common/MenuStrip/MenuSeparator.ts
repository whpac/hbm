import MenuStripItem from './MenuStripItem';

export default class MenuSeparator extends MenuStripItem {

    protected Render(): HTMLElement {
        let li = super.Render();
        li.classList.add('separator');
        return li;
    }
}