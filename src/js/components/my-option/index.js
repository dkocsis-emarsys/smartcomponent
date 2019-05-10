import SmartComponent from '../../libs/smartcomponent';

export default class MyOption extends SmartComponent {
  init() {
    super.init();
    this._state.setOption('notifyParent', true);
    this._state.setOption('watchContent', true);
  }

  static get observedAttributes() {
    return ['value'];
  }

  set value(value) {
    this._state.set('value', value);
  }

  connectedCallback() {
    this._state.set('content', this.textContent);
  }

  _mutationObserverCallback() {
    this._state.set('content', this.textContent);
  }
}
