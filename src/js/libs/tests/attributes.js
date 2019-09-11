import SmartComponent from '../smartcomponent';

export default class TestAttributes extends SmartComponent {
  static get observedAttributes() {
    return ['value', 'data-value'];
  }
}
