import { LightningElement, api, track } from 'lwc';
import Set_this_Output from '@salesforce/label/c.Set_this_Output';
import To_the_value_of_this_key from '@salesforce/label/c.To_the_value_of_this_key';

export default class TargetKeyInput extends LightningElement {
    @api entity = {};
    labels = {
        Set_this_Output,
        To_the_value_of_this_key
    }
    _builderContext;
    _flowVariables;
    @api 
    get builderContext() {
        return this._builderContext;
    }

    set builderContext(context) {
        
        this._builderContext = context || {};
        if (this._builderContext) {
            const { variables } = this._builderContext;
            this._flowVariables = [...variables];
        }
    }
    get key(){
        return this.entity.key;
    }

    get value(){
        return this.entity.value;
    }

    get valueType() {
        if(!this.entity || !this.entity.value) {
            return 'String';
        }

        if(this.entity.value.startsWith('{!') && this.entity.value.endsWith('}')) {
            return 'reference';
        }

        return 'String';
    }

    get showButton() {
        return this.entity.order > 0;
    }
    changeKey(event) {
        this.entity = JSON.parse(JSON.stringify(this.entity));
        this.entity.key = event.detail.value;
        const valueChangedEvent = new CustomEvent('changeinput', {
            detail: {
                entity: this.entity,
            }
        });
        this.dispatchEvent(valueChangedEvent);
    }

    changeValue(event) {
        this.entity = JSON.parse(JSON.stringify(this.entity));
        if(event && event.detail) {
            this.entity.value = event.detail.newValue;
            if(event.detail.newValueDataType === 'reference') {
                this.entity.value = '{!' + this.entity.value + '}';
            }
        }
        const valueChangedEvent = new CustomEvent('changeinput', {
            detail: {
                entity: this.entity,
            }
        });
        this.dispatchEvent(valueChangedEvent);
    }

    remove() {
        const removeItemEvent = new CustomEvent('removeitem', {
            detail: {
                entity: this.entity,
            }
        });
        this.dispatchEvent(removeItemEvent);
    }
}