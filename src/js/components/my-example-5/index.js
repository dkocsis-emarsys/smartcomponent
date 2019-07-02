import SmartComponent from '../../libs/smartcomponent';
import template from './template';

export default class MyExample5 extends SmartComponent {
  init() {
    this._container = this._parseHTML(`<div class="my-example-5"></div>`);

    super.init({
      render: {
        container: this._container,
        template: template,
        globalState: 'example5'
      }
    });

    this._state.set('name', 'John Doe');
    this._globalState.set('example5.age', 22);
  }

  static get observedAttributes() {
    return ['name', 'age'];
  }

  get stateAttributes() {
    return ['name'];
  }

  set age(value) {
    this._globalState.set('example5.age', value);
  }
}
