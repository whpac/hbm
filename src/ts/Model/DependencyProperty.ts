type ChangeHandler<T> = (new_value: T, old_value: T) => void;

/**
 * A class that is monitoring all property changes
 */
export default class DependencyProperty<T> {
    protected Value: T;
    protected ChangeListeners: ChangeHandler<T>[];

    /**
     * Instantiates a class that is monitoring all property changes
     * @param value The initial value of the property
     */
    public constructor(value: T) {
        this.Value = value;
        this.ChangeListeners = [];
    }

    /**
     * Sets a new value of the property
     * @param value The new value of the property
     */
    public Set(value: T) {
        let old_value = this.Value;
        this.Value = value;

        if(value !== old_value) {
            this.FireChange(value, old_value);
        }
    }

    /**
     * Returns the property value
     */
    public Get() {
        return this.Value;
    }

    /**
     * Registers a change event listener
     * @param handler The change event handler
     */
    public AddOnChange(handler: ChangeHandler<T>) {
        this.ChangeListeners.push(handler);
    }

    /**
     * Fires the change event
     * @param new_value The new property value
     * @param old_value The old property value
     */
    protected FireChange(new_value: T, old_value: T) {
        for(let handler of this.ChangeListeners) {
            handler(new_value, old_value);
        }
    }
}