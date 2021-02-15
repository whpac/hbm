import Component from '../Component';
import { DropdownDirection } from './DropdownDirection';

export default class MenuStripItem<TEvent extends string = ""> extends Component<TEvent | 'Click'> {
    private _IconSpaceRequired: boolean = false;
    private _DropdownDirection: DropdownDirection = DropdownDirection.NO_DROPDOWN;

    public get IconSpaceRequired() {
        return this._IconSpaceRequired;
    }
    public set IconSpaceRequired(value: boolean) {
        this._IconSpaceRequired = value;
        this.OnIconRequirementChange();
    }

    public get DropdownDirection() {
        return this._DropdownDirection;
    }
    public set DropdownDirection(value: DropdownDirection) {
        this._DropdownDirection = value;
        this.OnDropdownDirectionChange();
    }

    protected Render(): HTMLElement {
        let li = document.createElement('li');
        return li;
    }

    protected OnIconRequirementChange() { }
    protected OnDropdownDirectionChange() { }
}