import SmartComponent from '../../libs/smartcomponent';

export default class MyExample3Child extends SmartComponent {
  init() {
    super.init({
      notifyParent: true,
      render: {
        container: this
      }
    });
  }

  static get observedAttributes() {
    return ['value'];
  }

  static get stateAttributes() {
    return ['value'];
  }

  static get template() {
    return component => `Value of the parent is: <b>${component._state.get('value')}</b>`;
  }
}
