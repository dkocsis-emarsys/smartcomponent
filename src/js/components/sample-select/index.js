import SmartComponent from '../../libs/smartcomponent';
import popupTemplate from './popup-template';

export default class SampleSelect extends SmartComponent {
  init() {
    super.init({ listenChildren: true });

    this._state.subscribe('isOpen', value => {
      if (value) {
        document.body.appendChild(this._templater.getContainer('popup'));
      } else {
        document.body.removeChild(this._templater.getContainer('popup'));
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
    return [{ name: 'dataName', as: 'name' }];
  }

  static get eventHandlers() {
    return {
      'opener:click': '_onOpenerClick',
      'option:click': '_onOptionClick'
    };
  }

  get template() {
    return [
      {
        name: 'select',
        markup: html => html`
          <input type="hidden" name="${this._state.get('name')}" value="${this._state.get('selectedOption.value')}">
          <div data-handler="opener" onclick="${this}">
            ${this._state.get('selectedOption.content') && this._state.get('selectedOption.content')() || 'Select an option'}
          </div>`,
        container: this._templater.parseHTML('<div class="container"></div>'),
        autoAppendContainer: true
      },
      {
        name: 'popup',
        markup: popupTemplate,
        container: this._templater.parseHTML('<div class="popup-container"></div>')
      }
    ];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._state.set('isOpen', false);
  }

  childrenChangedCallback(collection) {
    const childrenList = collection.get();
    this._state.set('options', childrenList);
  }

  _onOpenerClick() {
    this._state.set('isOpen', value => !value);
  }

  _onOptionClick(event) {
    const option = this._state.get('options').find(option => option.state.value === event.currentTarget.dataset.value);

    this._state.set('selectedOption.value', option.state.value);
    this._state.set('selectedOption.content', option.state.content, { storeFunction: true });
    this._state.set('isOpen', false);
  }
}
