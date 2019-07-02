import SmartComponent from '../../libs/smartcomponent';

export default class MyExample3Child extends SmartComponent {
  init() {
    super.init({
      notifyParent: true
    });
  }

  static get observedAttributes() {
    return ['value'];
  }

  set value(value) {
    this.textContent = `Value of the parent is: ${value}`;
  }
}
