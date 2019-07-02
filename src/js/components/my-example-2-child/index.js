import SmartComponent from '../../libs/smartcomponent';

export default class MyExample2Child extends SmartComponent {
  init() {
    super.init({
      notifyParent: true
    });

    this._state.set('value', Math.random());
  }

  static get observedAttributes() {
    return ['value'];
  }

  set value(value) {
    this._state.set('value', value);
  }
}