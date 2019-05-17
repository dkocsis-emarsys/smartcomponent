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

    this.addEventListener('click', this._toggle.bind(this), true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._state.set('opened', false);
  }

  childrenChangedCallback(collection) {
    const childrenList = collection.get();
    const items = childrenList.map(child => {
      if (child.data.selected) {
        this._setSelectedOption(child.data.value, child.data.content);
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
      this.setAttribute('content', state.selectedOption.content);
    } else {
      this.removeAttribute('content');
    }

    this.classList.toggle('my-select--opened', state.opened);

    if (state.opened) {
      render(this._container, template(state));

      this._scrollToSelectedElement();
    }
  }

  get selected() {
    const selectedOption = this._state.get('selectedOption');
    return selectedOption ? selectedOption.value : false;
  }

  set value(value) {
    const items = this._state.get('items');
    const selectedOption = items.find(item => item.value === value);

    if (!selectedOption) { return; }

    this._setSelectedOption(selectedOption.value, selectedOption.content);
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
      selectedOption: { value: child.data.value, content: child.data.content }
    });
  }

  _dispatchChangeEvent(value) {
    this._dispatchEvent('change', value);
  }

  _scrollToSelectedElement() {
    if (this._state.get('selectedOption')) {
      const selectedElement = this._container.querySelector('.my-option--active');
      this._container.scrollTop = selectedElement.offsetTop - 16;
    }
  }

  _setSelectedOption(value, content) {
    this._state.set('selectedOption', { value, content });
  }
}
