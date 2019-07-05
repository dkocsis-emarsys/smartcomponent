import SmartComponent from '../../libs/smartcomponent';

export default class MyExample4B extends SmartComponent {
  init() {
    this._globalStatePrefix = 'example4';

    super.init({
      render: {
        container: this,
        globalState: this._globalStatePrefix
      }
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

  static get template() {
    return component => `
      Global state value is: <b>${component._globalState.get(`${component._globalStatePrefix}.value`)}</b>
      |
      Local state value is: <b>${component._state.get('value')}</b>
    `;
  }
}
