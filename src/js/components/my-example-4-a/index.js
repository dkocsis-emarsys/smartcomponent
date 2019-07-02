import SmartComponent from '../../libs/smartcomponent';

export default class MyExample4A extends SmartComponent {
  init() {
    super.init();

    this._globalState.set('example4.value', Math.random());
    this._state.set('value', Math.random());

    this._globalState.subscribe('example4.value', this._setHTML.bind(this));
    this._state.subscribe('value', this._setHTML.bind(this));
  }

  static get observedAttributes() {
    return ['global', 'local'];
  }

  set global(value) {
    this._globalState.set('example4.value', value);
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
