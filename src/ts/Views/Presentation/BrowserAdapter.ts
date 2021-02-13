export default class BrowserAdapter {
    /** Contains the content wrapper which will house the displayed pages */
    protected ContentWrapper: HTMLElement;

    public constructor(target_element: HTMLElement) {
        this.ContentWrapper = target_element;
    }

    /**
     * Changes the currently displayed page
     * @param element The new page
     */
    public ChangePage(element: HTMLElement) {
        while(this.ContentWrapper.firstChild !== null) {
            this.ContentWrapper.removeChild(this.ContentWrapper.lastChild!);
        }
        this.ContentWrapper.appendChild(element);
    }

    /**
     * Prepares the display to page change
     */
    public PrepareToPageChange() {
        this.ContentWrapper.appendChild(document.createTextNode('Loading...'));
    }
}