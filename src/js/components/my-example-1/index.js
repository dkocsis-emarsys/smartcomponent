import SmartComponent from '../../libs/smartcomponent';

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

  static get stateAttributes() {
    return ['value'];
  }

  static get template() {
    return component => `Value of the component is: <b>${component._state.get('value')}</b>`;
  }
}
