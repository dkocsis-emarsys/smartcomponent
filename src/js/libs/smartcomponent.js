import Symbol from 'es6-symbol';
import CustomEvent from 'custom-event';
import { html } from 'lighterhtml';
import State from './state';
import Collection from './collection';

class HTMLCustomElement extends HTMLElement {
  constructor(...$) { const _ = super(...$); _.init(); return _; }
  init() {}
}

export default class SmartComponent extends HTMLCustomElement {
  init() {
    this._state = new State({
      options: {
        id: Symbol(),
        listenChildren: false,
        notifyParent: false,
        notifyParentOnStateChange: false,
        watchContent: false,
        renderContainer: null,
        appendRenderContainer: true,
        connectedChildren: new Collection()
      }
    }, this._renderCallback.bind(this));

    this.__childConnectedCallback = this.__childConnectedCallback.bind(this);
    this.__childDisconnectedCallback = this.__childDisconnectedCallback.bind(this);

    this._state.subscribeOption('notifyParent', this.__notifyParent.bind(this));
    this._state.subscribeOption('listenChildren', this.__listenChildren.bind(this));
    this._state.subscribeOption('watchContent', this.__watchContent.bind(this));

    this.__mutationObserver = new MutationObserver(this._mutationObserverCallback.bind(this));
    this.__notifyParentSubscription = null;
  }

  connectedCallback() {
    const renderContainer = this._state.getOption('renderContainer');
    const appendRenderContainer = this._state.getOption('appendRenderContainer');

    if (renderContainer) {
      if (appendRenderContainer) { this.appendChild(renderContainer); }

      this._renderCallback();
    }

    this.__notifyParentEvent('_child.connected');
  }

  disconnectedCallback() {
    const renderContainer = this._state.getOption('renderContainer');

    if (renderContainer) { renderContainer.parentNode.removeChild(renderContainer); }

    this.__notifyParentEvent('_child.disconnected');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const transformedName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());
    this[transformedName] = newValue;
  }

  _renderCallback() {}
  _mutationObserverCallback() {}

  _convertAttributeToBoolean(value) {
    return value !== undefined && value !== null && value !== false && value !== 'false';
  }

  _parseHTML(content) {
    const parser = new DOMParser();
    return parser.parseFromString(content, 'text/html').body.childNodes[0];
  }

  __notifyParent(value) {
    if (value) {
      this.__notifyParentSubscription = this._state.subscribe('', () => {
        this.__notifyParentEvent('_child.changed');
      });
    } else if (this.__notifyParentSubscription) {
      this.__notifyParentSubscription.unsubscribe();
    }
  }

  __notifyParentEvent(eventName) {
    if (!this._state.getOption('notifyParent')) { return; }

    this.dispatchEvent(new CustomEvent(eventName, {
      detail: {
        id: this._state.getOption('id'),
        data: this._state.get()
      },
      bubbles: true
    }));
  }

  __listenChildren() {
    if (this._state.getOption('listenChildren')) {
      this.addEventListener('_child.connected', this.__childConnectedCallback);
      this.addEventListener('_child.changed', this.__childChangedCallback);
    } else {
      this.removeEventListener('_child.connected', this.__childConnectedCallback);
      this.removeEventListener('_child.changed', this.__childChangedCallback);
    }
  }

  __childConnectedCallback(event) {
    event.target.addEventListener('_child.disconnected', this.__childDisconnectedCallback);

    const childrenCollection = this._state.getOption('connectedChildren');
    childrenCollection.upsert({ id: event.detail.id, element: event.target, data: event.detail.data });
    this._state.triggerOptionChange('connectedChildren');
  }

  __childChangedCallback(event) {
    const childrenCollection = this._state.getOption('connectedChildren');
    childrenCollection.upsert({ id: event.detail.id, element: event.target, data: event.detail.data });
    this._state.triggerOptionChange('connectedChildren');
  }

  __childDisconnectedCallback(event) {
    const childrenCollection = this._state.getOption('connectedChildren');
    childrenCollection.remove(event.detail.id);
    this._state.triggerOptionChange('connectedChildren');
  }

  __watchContent() {
    if (this._state.getOption('watchContent')) {
      this.__mutationObserver.observe(this, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    } else {
      this.__mutationObserver.disconnect();
    }
  }
}
