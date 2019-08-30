import SmartComponent from '../../libs/smartcomponent';

export default class MyExample1 extends SmartComponent {
  static get observedAttributes() {
    return ['value'];
  }

  static get boundProperties() {
    return ['value'];
  }

  get template() {
    return html => html`The value is: <b>${this._state.get('value')}</b>`;
  }
}
