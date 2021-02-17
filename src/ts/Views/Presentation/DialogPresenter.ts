import Component from '../Common/Component';
import Dialog from '../Common/Dialog/Dialog';
import BrowserAdapter from './BrowserAdapter';

export default class DialogPresenter {
    protected static Dialogs: Dialog[] | undefined;
    protected static DisplayAdapter: BrowserAdapter | undefined;
    protected static DialogBackplate: HTMLElement | undefined;

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
        dialog.AddEventListener('Closed', this.OnDialogHide.bind(this));

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
        if(this.DialogBackplate === undefined) {
            this.DialogBackplate = document.createElement('div');
            this.DialogBackplate.classList.add('dialog-backplate');
        }
        document.body.appendChild(this.DialogBackplate);
    }

    protected static HideBackplate() {
        if(this.DialogBackplate === undefined) return;
        document.body.removeChild(this.DialogBackplate);
    }

    protected static OnDialogHide(component: Component<string>) {
        if(this.Dialogs === undefined) return;

        let dialog = component as Dialog;

        if(this.Dialogs[this.Dialogs.length - 1] === dialog) {
            this.ReturnToPreviousDialog();
        } else {
            this.Dialogs = this.Dialogs.filter((d) => d !== dialog);
        }
    }
}