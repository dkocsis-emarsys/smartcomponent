import SmartComponent from '../../libs/smartcomponent';

export default class MyExample1 extends SmartComponent {
  static get observedAttributes() {
    return ['value'];
  }

  set value(value) {
    this.textContent = `Value of the component is: ${value}`;
  }
}
