import SmartComponent from '../../libs/smartcomponent';

export default class MyExample2 extends SmartComponent {
  init() {
    this._container = this._parseHTML(`<div class="my-example-2-value"></div>`);

    super.init({
      listenChildren: true,
      render: {
        container: this._container
      }
    });
  }

  static get template() {
    return component => `Value of the child component is: <b>${component._state.get('childValue')}</b>`;
  }

  childrenChangedCallback(collection) {
    const childrenList = collection.get();

    const items = childrenList.map(child => {
      this._state.set('childValue', child.state.value);
    });
  }
}
