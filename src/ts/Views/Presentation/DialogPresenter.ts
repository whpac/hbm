import Dialog from '../Common/Dialog/Dialog';
import BrowserAdapter from './BrowserAdapter';

export default class DialogPresenter {
    protected static Dialogs: Dialog[] | undefined;
    protected static DisplayAdapter: BrowserAdapter | undefined;

    /**
     * Displays a dialog
     * @param dialog The dialog to display
     */
    public static async DisplayDialog(dialog: Dialog) {
        if(this.DisplayAdapter === undefined) {
            // TODO: Throw
            throw null;
        }

        if(this.Dialogs === undefined) this.Dialogs = [];
        this.Dialogs.push(dialog);

        if(this.Dialogs.length == 1) this.DisplayBackplate();

        this.DisplayAdapter.ChangePage(dialog.GetElement());
    }

    /**
     * Sets the display adapter for dialogs
     * @param adapter The display adapter
     */
    public static SetDisplayAdapter(adapter: BrowserAdapter) {
        this.DisplayAdapter = adapter;
    }

    protected static ReturnToPreviousDialog() {
        if(this.Dialogs === undefined) return;
        if(this.Dialogs.length == 0) return;

        if(this.DisplayAdapter === undefined) {
            // TODO: Throw
            throw null;
        }

        this.Dialogs?.pop();
        if(this.Dialogs.length > 0) {
            this.DisplayAdapter.ChangePage(this.Dialogs[this.Dialogs.length - 1].GetElement());
        } else {
            this.HideBackplate();
        }
    }

    protected static DisplayBackplate() {

    }

    protected static HideBackplate() {

    }
}