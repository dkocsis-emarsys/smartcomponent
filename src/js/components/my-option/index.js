import SmartComponent from '../../libs/smartcomponent';

export default class MyOption extends SmartComponent {
  init() {
    super.init({
      notifyParent: true,
      watchContent: true
    });

    this._state.set('selected', false);
  }

  static get observedAttributes() {
    return ['value', 'selected'];
  }

  set value(value) {
    this._state.set('value', value);
  }

  set selected(value) {
    this._state.set('selected', super._convertAttributeToBoolean(value));
  }

  connectedCallback() {
    super.connectedCallback();

    this._state.set('content', this.textContent);
  }

  contentChangedCallback() {
    this._state.set('content', this.textContent);
  }
}
