import dispatcher from 'dispatcher';
import axios from 'axios';

class ElementClass extends HTMLFormElement {
    constructor(self) {
        self = super(self);
        self.init.call(self);
    }

    init() {

    }
    connectedCallback() {

    }
    disconnectedCallback() {

    }
}

customElements.define('form-component', ElementClass, {extends: 'form'});

export default ElementClass;