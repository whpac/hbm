import BrowserAdapter from './BrowserAdapter';
import Page from './Page';

export default class Presenter {
    protected static CurrentPage: Page | undefined;
    protected static DisplayAdapter: BrowserAdapter | undefined;

    public static async DisplayPage(page: Page) {
        if(this.DisplayAdapter === undefined) {
            // TODO: Throw
            throw null;
        }

        this.DisplayAdapter.PrepareToPageChange();

        await this.CurrentPage?.Unload();
        this.CurrentPage = page;
        await this.CurrentPage.Load();

        this.DisplayAdapter.ChangePage(this.CurrentPage.GetElement());
    }

    public static SetDisplayAdapter(adapter: BrowserAdapter) {
        this.DisplayAdapter = adapter;
    }
}