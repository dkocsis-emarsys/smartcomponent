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

    this._globalState.set(`${this._globalStatePrefix}.age`, 22);
  }

  static get observedAttributes() {
    return ['name', 'age'];
  }

  static get stateAttributes() {
    return ['name'];
  }

  static get validationRules() {
    return {
      name: {
        defaultValue: 'John Doe'
      }
    };
  }

  static get template() {
    return template;
  }

  static get eventHandlers() {
    return {
      'name:input': '_nameInputHandler',
      'age:input': '_ageInputHandler'
    }
  }

  set age(value) {
    this._globalState.set(`${this._globalStatePrefix}.age`, value);
  }

  _nameInputHandler(event) {
    this.name = event.target.value;
  }

  _ageInputHandler(event) {
    this.age = event.target.value;
  }
}
