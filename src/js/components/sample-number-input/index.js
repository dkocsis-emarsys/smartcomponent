import SmartComponent from '../../libs/smartcomponent';

export default class SampleNumberInput extends SmartComponent {
  init() {
    super.init();

    this._state.setOptions('value', {
      type: 'custom',
      transformFunction: value => {
        value = parseInt(value);
        if (isNaN(value)) { value = this._state.get('min'); }

        return Math.min(Math.max(this._state.get('min') || 0, value), this._state.get('max') || 0);
      }
    });
  }

  static get defaultState() {
    return { value: 0 };
  }

  static get observedAttributes() {
    return ['data-value', 'data-min', 'data-max', 'data-name'];
  }

  static get boundProperties() {
    return [
      { name: 'dataValue', as: 'value' },
      { name: 'dataMin', as: 'min' },
      { name: 'dataMax', as: 'max' },
      { name: 'dataName', as: 'name' }
    ];
  }

  static get eventHandlers() {
    return {
      'input:input': '_onInputInput',
      'decrease:click': '_onDecreaseClick',
      'increase:click': '_onIncreaseClick'
    };
  }

  static get template() {
    return (html, component) => html`
      <input type="hidden" name="${component._state.get('name')}" value="${component._state.get('value')}">
      <button data-handler="decrease" onclick="${component}">-</button>
      <input type="text" value="${component._state.get('value')}" data-handler="input" oninput="${component}">
      <button data-handler="increase" onclick="${component}">+</button>
    `;
  }

  _onInputInput(event) {
    this._state.set('value', event.target.value);
    event.target.value = this._state.get('value');
  }

  _onDecreaseClick() {
    this._state.set('value', value => --value);
  }

  _onIncreaseClick() {
    this._state.set('value', value => ++value);
  }
}
