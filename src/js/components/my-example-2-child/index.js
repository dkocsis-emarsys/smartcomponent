import SmartComponent from '../../libs/smartcomponent';

export default class MyExample2Child extends SmartComponent {
  init() {
    super.init({
      notifyParent: true
    });
  }

  static get observedAttributes() {
    return ['value'];
  }

  static get boundPropertiesToState() {
    return ['value'];
  }
}
