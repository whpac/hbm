import Component from '../Component';
import { DropdownDirection } from './DropdownDirection';

type MenuStripItemEvents =
    'Click' | 'DropdownDirectionChanged' | 'EnabledChanged' | 'IconRequirementChanged';

export default class MenuStripItem<TEvent extends string = ""> extends Component<TEvent | MenuStripItemEvents> {
    private _DropdownDirection: DropdownDirection = DropdownDirection.NO_DROPDOWN;
    private _Enabled: boolean = true;
    private _IconSpaceRequired: boolean = false;

    /** Determines the direction of a dropdown chevron */
    public get DropdownDirection() {
        return this._DropdownDirection;
    }
    public set DropdownDirection(value: DropdownDirection) {
        this._DropdownDirection = value;
        this.FireEvent('DropdownDirectionChanged');
    }

    public get Enabled() {
        return this._Enabled;
    }
    public set Enabled(value: boolean) {
        this._Enabled = value;
        this.FireEvent('EnabledChanged');
    }

    /** Determines whether the menu item should display a space for an icon */
    public get IconSpaceRequired() {
        return this._IconSpaceRequired;
    }
    public set IconSpaceRequired(value: boolean) {
        this._IconSpaceRequired = value;
        this.FireEvent('IconRequirementChanged');
    }

    protected Render(): HTMLElement {
        let li = document.createElement('li');
        return li;
    }
}