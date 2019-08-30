import SmartComponent from '../../libs/smartcomponent';

export default class MyExample2 extends SmartComponent {
  init() {
    this._container = this.constructor._parseHTML(`<div class="my-example-2-value"></div>`);

    super.init({
      listenChildren: true,
      render: {
        container: this._container
      }
    });
  }

  get template() {
    return html => html`Value of the child component is: <b>${this._state.get('childValue')}</b>`;
  }

  childrenChangedCallback(collection) {
    const childrenList = collection.get();
    const items = childrenList.map(child => {
      this._state.set('childValue', child.state.value);
    });
  }
}
