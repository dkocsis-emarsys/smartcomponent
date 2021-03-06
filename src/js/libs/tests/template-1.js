import SmartComponent from '../smartcomponent';

export default class TestTemplate1 extends SmartComponent {
  static get boundProperties() {
    return ['value'];
  }

  static get eventHandlers() {
    return {
      'increase:click': '_onIncreaseClick'
    };
  }

  get template() {
    return html => html`
      <div>Hello World ${this._state.get('value')}!</div>
      <button data-handler="increase" onclick="${this}"></button>
    `;
  }

  _onIncreaseClick() {
    this._state.set('value', value => ++value);
  }
}
