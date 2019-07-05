import SmartComponent from '../../libs/smartcomponent';

export default class MyExample3 extends SmartComponent {
  init() {
    super.init({
      listenChildren: true
    });

    this._state.subscribe('value', this._updateChildrenValue.bind(this));
  }

  static get observedAttributes() {
    return ['value'];
  }

  static get stateAttributes() {
    return ['value'];
  }

  static get validationRules() {
    return {
      value: {
        defaultValue: Math.random()
      }
    };
  }

  childrenChangedCallback(collection) {
    this._state.set('children', collection.get());
    this._updateChildrenValue();
  }

  _updateChildrenValue() {
    const value = this._state.get('value');

    this._state.get('children').forEach(child => child.element.value = value);
  }
}
