import SmartComponent from '../../libs/smartcomponent';
import { html, render } from 'lighterhtml';

export default class SampleSelectOption extends SmartComponent {
  init() {
    super.init({ notifyParent: true });
  }

  static get observedAttributes() {
    return ['data-value', 'data-thumbnail'];
  }

  static get boundProperties() {
    return [
      { name: 'dataValue', as: 'value' },
      { name: 'dataThumbnail', as: 'thumbnail' }
    ];
  }

  get template() {
    return [{ name: 'inside', markup: this.querySelector('div') }];
  }

  connectedCallback() {
    super.connectedCallback();

    this._state.set('content', this._templater.render('inside'), { storeFunction: true });
  }

  contentChangedCallback() {
    this._state.set('content', this._templater.render('inside'), { storeFunction: true });
  }
}
