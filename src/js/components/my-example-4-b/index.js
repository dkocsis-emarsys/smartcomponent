import SmartComponent from '../../libs/smartcomponent';

export default class MyExample4B extends SmartComponent {
  init() {
    super.init();

    this._state.set('value', Math.random());

    this._globalState.subscribe('example4.value', this._setHTML.bind(this));
    this._state.subscribe('value', this._setHTML.bind(this));
  }

  static get observedAttributes() {
    return ['local'];
  }

  set local(value) {
    this._state.set('value', value);
  }

  connectedCallback() {
    super.connectedCallback();

    this._setHTML();
  }

  _setHTML() {
    this.innerHTML = `
      Global state value is: ${this._globalState.get('example4.value')}
      |
      Local state value is: ${this._state.get('value')}
    `;
  }
}
