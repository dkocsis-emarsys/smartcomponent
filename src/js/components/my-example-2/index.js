import SmartComponent from '../../libs/smartcomponent';

export default class MyExample2 extends SmartComponent {
  init() {
    super.init({
      listenChildren: true
    });
  }

  childrenChangedCallback(collection) {
    const childrenList = collection.get();

    const items = childrenList.map(child => {
      this.querySelector('#my-example-2-value').textContent = `Value of the child component is: ${child.state.value}`;
    });
  }
}
