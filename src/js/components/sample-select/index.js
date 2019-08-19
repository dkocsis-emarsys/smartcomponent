import SmartComponent from '../../libs/smartcomponent';
import popupTemplate from './popup-template';

export default class SampleSelect extends SmartComponent {
  init() {
    this._container = this.constructor._parseHTML('<div class="container"></div>');
    this._popupContainer = this.constructor._parseHTML('<div class="popup-container"></div>');
    super.init({
      listenChildren: true,
      render: {
        container: this._container
      }
    });
  }

  static get defaultState() {
    return {
      options: [],
      isOpen: false
    };
  }

  static get observedAttributes() {
    return ['data-name'];
  }

  static get boundProperties() {
    return [
      { name: 'dataName', as: 'name' }
    ];
  }

  static get eventHandlers() {
    return {
      'opener:click': '_onOpenerClick',
      'option:click': '_onOptionClick'
    };
  }

  static get template() {
    return (html, component) => html`
      <input type="hidden" name="${component._state.get('name')}" value="${component._state.get('value')}">
      <div data-handler="opener" onclick="${component}">${component._state.get('content') || 'Select an option'}</div>
      ${component._state.get('isOpen') ? popupTemplate(html, component) : ''}
    `;
  }

  childrenChangedCallback(collection) {
    const childrenList = collection.get();
    this._state.set('options', childrenList);
  }

  _onOpenerClick() {
    this._state.set('isOpen', value => !value);
  }

  _onOptionClick(event) {
    this._state.set('value', event.target.dataset.value);
    this._state.set('content', event.target.dataset.content);
    this._state.set('isOpen', false);
  }
}
