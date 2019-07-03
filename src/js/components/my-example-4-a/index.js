import SmartComponent from '../../libs/smartcomponent';

export default class MyExample4A extends SmartComponent {
  init() {
    this._globalStatePrefix = 'example4';

    super.init({
      render: {
        container: this,
        globalState: this._globalStatePrefix
      }
    });

    this._globalState.set('example4.value', Math.random());
    this._state.set('value', Math.random());
  }

  static get observedAttributes() {
    return ['global', 'value'];
  }

  static get stateAttributes() {
    return ['value'];
  }

  static get template() {
    return component => `
      Global state value is: <b>${component._globalState.get(`${component._globalStatePrefix}.value`)}</b>
      |
      Local state value is: <b>${component._state.get('value')}</b>
    `;
  }

  set global(value) {
    this._globalState.set('example4.value', value);
  }
}
