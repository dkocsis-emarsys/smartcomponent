import { render } from 'lighterhtml';
import SmartComponent from '../../libs/smartcomponent';
import template from './template';

export default class MySelect extends SmartComponent {
  init() {
    super.init();

    const container = this._parseHTML(`<div class="my-select__list"></div>`);

    this._state.setOption('renderContainer', container);
    this._state.setOption('appendRenderContainer', false);
    this._state.setOption('listenChildren', true);

    this._state.subscribeOption('connectedChildren', this._childrenChangedCallback.bind(this));
    this._state.subscribe('opened', this._appendContainer.bind(this));
    this._state.subscribe('selectedOption', this._dispatchChangeEvent.bind(this));

    this.addEventListener('click', this._toggle.bind(this));
  }

  disconnectedCallback() {
    this._state.set('opened', false);
  }

  _appendContainer(value) {
    const renderContainer = this._state.getOption('renderContainer');

    if (value) {
      document.body.appendChild(renderContainer);
    } else if (renderContainer.parentNode) {
      renderContainer.parentNode.removeChild(renderContainer);
    }
  }

  _toggle() {
    this._state.get('opened') ? this._state.set('opened', false) : this._state.set('opened', true);
  }

  _childrenChangedCallback(collection) {
    const childrenList = collection.get();
    const items = childrenList.map(child => ({
      content: child.data.content,
      value: child.data.value,
      events: {
        click: () => this._onClick(child)
      }
    }));

    this._state.set('items', items);
  }

  _onClick(child) {
    this._state.setMultiple([
      { name: 'opened', value: false },
      { name: 'selectedOption', value: child }
    ]);
  }

  _dispatchChangeEvent(value) {
    this._dispatchEvent('change', value);
  }

  _renderCallback() {
    const selectedOption = this._state.get('selectedOption');
    if (selectedOption) {
      this.setAttribute('content', selectedOption.data.content);
    }

    const renderContainer = this._state.getOption('renderContainer');
    const state = this._state.get();

    if (!state || !state.opened) { return; }

    render(renderContainer, template(state));
  }
}
