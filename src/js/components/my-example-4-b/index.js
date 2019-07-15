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

  static get stateOptions() {
    return {
      value: {
        defaultValue: Math.random()
      }
    };
  }

  static get observedAttributes() {
    return ['value'];
  }

  static get boundPropertiesToState() {
    return ['value'];
  }

  static get template() {
    return component => `
      Global state value is: <b>${component._globalState.get(`${component._globalStatePrefix}.value`)}</b>
      |
      Local state value is: <b>${component._state.get('value')}</b>
    `;
  }
}
