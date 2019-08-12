import SmartComponent from '../../libs/smartcomponent';
import { html } from 'lighterhtml';

export default class MyExample3 extends SmartComponent {
  static get defaultState() {
    return { clicks: 0 };
  }

  static get eventHandlers() {
    return { ':click': '_onClick' }
  }

  static get template() {
    return component => html`<button>Clicked <b>${component._state.get('clicks')}</b> times.</button>`
  }

  _onClick() {
    this._state.set('clicks', value => ++value);
  }
}
