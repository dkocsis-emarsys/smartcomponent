import SmartComponent from '../../libs/smartcomponent';

export default class MyExample3Child extends SmartComponent {
  init() {
    super.init({
      notifyParent: true,
      render: {
        container: this
      }
    });
  }

  static get observedAttributes() {
    return ['value'];
  }

  static get boundPropertiesToState() {
    return [
      {
        name: 'value',
        as: 'group.value',
        options: {
          triggerCallback: false
        }
      }
    ];
  }

  static get template() {
    return component => `Value of the parent is: <b>${component._state.get('group.value')}</b>`;
  }
}
