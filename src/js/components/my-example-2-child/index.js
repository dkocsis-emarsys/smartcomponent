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

  static get stateAttributes() {
    return ['value'];
  }

  static get validationRules() {
    return {
      value: {
        defaultValue: Math.random()
      }
    };
  }
}
