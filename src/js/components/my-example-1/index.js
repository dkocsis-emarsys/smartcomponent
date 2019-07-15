import SmartComponent from '../../libs/smartcomponent';
import { html } from 'lighterhtml';

export default class MyExample1 extends SmartComponent {
  init() {
    super.init({
      render: {
        container: this
      }
    });
  }

  static get observedAttributes() {
    return ['value'];
  }

  static get boundPropertiesToState() {
    return ['value'];
  }

  static get template() {
    return component => () => html`The value is: <b>${component._state.get('value')}</b>`;
  }
}
