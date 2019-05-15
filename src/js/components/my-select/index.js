import { render } from 'lighterhtml';
import SmartComponent from '../../libs/smartcomponent';
import template from './template';

export default class MySelect extends SmartComponent {
  init() {
    this._container = this._parseHTML(`<div class="my-select__list"></div>`);

    super.init({
      renderContainer: this._container,
      appendRenderContainer: false,
      listenChildren: true
    });

    this._state.set('opened', false);

    this._state.subscribe('opened', this._appendContainer.bind(this));
    this._state.subscribe('selectedOption', this._dispatchChangeEvent.bind(this));

    this.addEventListener('click', this._toggle.bind(this));
  }

  disconnectedCallback() {
    this._state.set('opened', false);
  }

  childrenChangedCallback(collection) {
    const childrenList = collection.get();
    const items = childrenList.map(child => {
      if (child.data.selected) {
        this._state.set('selectedOption', child);
      }

      return {
        content: child.data.content,
        value: child.data.value,
        events: {
          click: () => this._onClick(child)
        }
      };
    });

    this._state.set('items', items);
  }

  renderCallback() {
    const state = this._state.get();

    if (!state) { return; }

    if (state.selectedOption) {
      this.setAttribute('content', state.selectedOption.data.content);
    } else {
      this.removeAttribute('content');
    }

    this.classList.toggle('my-select--opened', state.opened);

    if (state.opened) {
      render(this._container, template(state));
    }
  }

  _appendContainer(value) {
    if (value) {
      document.body.appendChild(this._container);
    } else if (this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }

  _toggle() {
    this._state.get('opened') ? this._state.set('opened', false) : this._state.set('opened', true);
  }

  _onClick(child) {
    this._state.setMultiple({
      opened: false,
      selectedOption: child
    });
  }

  _dispatchChangeEvent(value) {
    this._dispatchEvent('change', value);
  }
}
