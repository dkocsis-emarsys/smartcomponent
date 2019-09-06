import SmartComponent from '../../libs/smartcomponent';

export default class MyExample2 extends SmartComponent {
  init() {
    super.init({ listenChildren: true });
  }

  get template() {
    return [{
      name: 'main',
      markup: this.querySelector('template'),
      container: this._templater.parseHTML(`<div class="my-example-2-value"></div>`),
      autoAppendContainer: true
    }];
  }

  childrenChangedCallback(collection) {
    const childrenList = collection.get();
    const items = childrenList.map(child => {
      this._state.set('childValue', child.state.value);
    });
  }
}
