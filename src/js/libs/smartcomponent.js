import Symbol from 'es6-symbol';
import CustomEvent from 'custom-event';
import { html } from 'lighterhtml';
import State from './state';
import Collection from './collection';

export default class SmartComponent extends HTMLElement {
  constructor(...$) { const _ = super(...$); _.init(); return _; }
  init(options = {}) {
    this._options = new State({
      id: Symbol(),
      listenChildren: false,
      notifyParent: false,
      notifyParentOnStateChange: false,
      watchContent: false,
      renderContainer: null,
      appendRenderContainer: true,
      connectedChildren: new Collection()
    }, this.renderCallback.bind(this));

    this._state = new State({}, this.renderCallback.bind(this));

    this.__childConnectedCallback = this.__childConnectedCallback.bind(this);
    this.__childDisconnectedCallback = this.__childDisconnectedCallback.bind(this);

    this._options.subscribe('notifyParent', this.__notifyParent.bind(this));
    this._options.subscribe('listenChildren', this.__listenChildren.bind(this));
    this._options.subscribe('watchContent', this.__watchContent.bind(this));

    this.__mutationObserver = new MutationObserver(this.contentChangedCallback.bind(this));
    this.__notifyParentSubscription = null;
    this.__listenChildrenSubscription = null;

    Object.keys(options).forEach(option => {
      this._options.set(option, options[option]);
    });
  }

  connectedCallback() {
    const renderContainer = this._options.get('renderContainer');
    const appendRenderContainer = this._options.get('appendRenderContainer');

    if (renderContainer) {
      if (appendRenderContainer) { this.appendChild(renderContainer); }

      this.renderCallback();
    }

    this.__notifyParentEvent('_child.connected');
  }

  disconnectedCallback() {
    const renderContainer = this._options.get('renderContainer');

    if (renderContainer) { renderContainer.parentNode.removeChild(renderContainer); }

    this.__notifyParentEvent('_child.disconnected');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const transformedName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());
    this[transformedName] = newValue;
  }

  renderCallback() {}
  contentChangedCallback() {}
  childrenChangedCallback() {}

  _convertAttributeToBoolean(value) {
    return value !== undefined && value !== null && value !== false && value !== 'false';
  }

  _parseHTML(content) {
    const parser = new DOMParser();
    return parser.parseFromString(content, 'text/html').body.childNodes[0];
  }

  _dispatchEvent(eventName, detail = {}) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true
    }));
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
    if (!this._options.get('notifyParent')) { return; }

    this.dispatchEvent(new CustomEvent(eventName, {
      detail: {
        id: this._options.get('id'),
        data: this._state.get()
      },
      bubbles: true
    }));
  }

  __listenChildren() {
    if (this._options.get('listenChildren')) {
      this.addEventListener('_child.connected', this.__childConnectedCallback);
      this.addEventListener('_child.changed', this.__childChangedCallback);
      this.__listenChildrenSubscription = this._options.subscribe('connectedChildren', this.childrenChangedCallback.bind(this));
    } else {
      this.removeEventListener('_child.connected', this.__childConnectedCallback);
      this.removeEventListener('_child.changed', this.__childChangedCallback);
      this.__listenChildrenSubscription.unsubscribe();
    }
  }

  __childConnectedCallback(event) {
    event.target.addEventListener('_child.disconnected', this.__childDisconnectedCallback);

    const childrenCollection = this._options.get('connectedChildren');
    childrenCollection.upsert({ id: event.detail.id, element: event.target, data: event.detail.data });
    this._options.triggerChange('connectedChildren');
  }

  __childChangedCallback(event) {
    const childrenCollection = this._options.get('connectedChildren');
    childrenCollection.upsert({ id: event.detail.id, element: event.target, data: event.detail.data });
    this._options.triggerChange('connectedChildren');
  }

  __childDisconnectedCallback(event) {
    const childrenCollection = this._options.get('connectedChildren');
    childrenCollection.remove(event.detail.id);
    this._options.triggerChange('connectedChildren');
  }

  __watchContent() {
    if (this._options.get('watchContent')) {
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
