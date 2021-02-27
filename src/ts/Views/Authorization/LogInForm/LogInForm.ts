import Component from '../../Common/Component';
import { ComponentState } from '../../Common/ComponentState';

export default class LogInForm extends Component<'LoginRequested'> {
    protected LoginInput: HTMLInputElement;
    protected PasswordInput: HTMLInputElement;
    protected SubmitButton: HTMLButtonElement;
    protected StatusText: HTMLElement;

    public constructor() {
        super();

        this.LoginInput = document.createElement('input');
        this.PasswordInput = document.createElement('input');
        this.SubmitButton = document.createElement('button');
        this.StatusText = document.createElement('div');
        this.SetState(ComponentState.READY);
    }

    protected Render(): HTMLElement {
        let form = document.createElement('form');
        form.addEventListener('submit', this.OnFormSubmit.bind(this));
        form.method = 'post';

        let header = document.createElement('h2');
        header.textContent = 'Log in';
        form.appendChild(header);

        let grid = document.createElement('div');
        grid.classList.add('grid-form');
        form.appendChild(grid);

        let login_label = document.createElement('label');
        login_label.textContent = 'Username:';
        grid.appendChild(login_label);

        this.LoginInput.id = login_label.htmlFor = 'field-login';
        this.LoginInput.type = 'text';
        this.LoginInput.name = 'hbm-login';
        this.LoginInput.autocomplete = 'username';
        grid.appendChild(this.LoginInput);

        let password_label = document.createElement('label');
        password_label.textContent = 'Password:';
        grid.appendChild(password_label);

        this.PasswordInput.id = password_label.htmlFor = 'field-password';
        this.PasswordInput.type = 'password';
        this.PasswordInput.name = 'hbm-password';
        this.PasswordInput.autocomplete = 'current-password';
        grid.appendChild(this.PasswordInput);

        this.StatusText.classList.add('error', 'whole-row');
        grid.appendChild(this.StatusText);

        this.SubmitButton.textContent = 'Log in';
        this.SubmitButton.type = 'submit';
        this.SubmitButton.classList.add('primary');
        grid.appendChild(this.SubmitButton);

        return form;
    }

    public AuthenticationFailed(error_text: string) {
        this.SubmitButton.disabled = false;
        this.StatusText.textContent = error_text;
        this.SetState(ComponentState.READY);
    }

    public HideLoadingIndicator() {
        this.SetState(ComponentState.READY);
    }

    protected OnFormSubmit(e: Event) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if(!this.Validate()) {
            return false;
        }

        let login = this.LoginInput.value;
        let password = this.PasswordInput.value;

        this.SetState(ComponentState.LOADING);
        this.LoginInput.value = '';
        this.PasswordInput.value = '';
        this.StatusText.textContent = '';
        this.SubmitButton.disabled = true;

        this.FireEvent('LoginRequested', {
            Login: login,
            Password: password
        });

        return false;
    }

    protected Validate() {
        let is_valid = true;

        is_valid &&= (this.LoginInput.value.trim().length != 0);
        is_valid &&= (this.PasswordInput.value.trim().length != 0);

        if(!is_valid) {
            this.StatusText.textContent = 'Both fields must not be empty.';
        } else {
            this.StatusText.textContent = '';
        }

        return is_valid;
    }
}