import SmartComponent from '../../libs/smartcomponent';
import template from './template';

export default class MyExample5 extends SmartComponent {
  init() {
    this._globalStatePrefix = 'example5';
    this._container = this._parseHTML(`<div class="my-example-5"></div>`);

    super.init({
      render: {
        container: this._container,
        globalState: this._globalStatePrefix
      }
    });

    this._state.set('name', 'John Doe');
    this._globalState.set(`${this._globalStatePrefix}.age`, 22);
  }

  static get observedAttributes() {
    return ['name', 'age'];
  }

  static get stateAttributes() {
    return ['name'];
  }

  static get template() {
    return template;
  }

  set age(value) {
    this._globalState.set(`${this._globalStatePrefix}.age`, value);
  }
}
