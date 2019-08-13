import SmartComponent from '../../libs/smartcomponent';

export default class MyExample1 extends SmartComponent {
  static get observedAttributes() {
    return ['value'];
  }

  static get boundProperties() {
    return ['value'];
  }

  static get template() {
    return (html, component) => html`The value is: <b>${component._state.get('value')}</b>`;
  }
}
