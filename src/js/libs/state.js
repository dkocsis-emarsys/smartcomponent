import deepMerge from './deep-merge';

export default class State {
  constructor(defaultData = {}, renderFunction = () => {}) {
    this._defaultData = defaultData;
    this._data = deepMerge({}, this._defaultData);
    this._renderFunction = renderFunction;
    this._subscriptions = [];
  }

  get(name) {
    return name ? name.split('.').reduce((item, index) => item ? item[index] : false, this._data) : this._data;
  }

  set(name, value, options = {}) {
    const modifiedData = name.split('.').reduceRight((previous, current) => ({ [current]: previous }), value);

    if (this._data[name] === modifiedData[name]) { return value; }

    this._data = deepMerge(this._data, modifiedData);

    if (options.triggerCallback === undefined || options.triggerCallback) { this._triggerCallback(name); }
    if (options.triggerRender === undefined || options.triggerRender) { this._renderFunction(); }

    return value;
  }

  setMultiple(list, options = {}) {
    Object.keys(list).forEach(name => {
      this.set(name, list[name], { triggerRender: false });
    });

    if (options.triggerRender === undefined || options.triggerRender) { this._renderFunction(); }
  }

  render() {
    this._renderFunction();
  }

  subscribe(name, callback) {
    const subscription = {
      id: Symbol(),
      name,
      callback
    };

    this._subscriptions.push(subscription);

    return { unsubscribe: this._unsubscribe.bind(subscription, this) };
  }

  unsubscribeAll(name) {
    this._subscriptions.forEach((subscription, index) => {
      if (subscription.name === name) {
        delete this._subscriptions[index];
      }
    });
  }

  triggerChange(name) {
    this._triggerCallback(name);
  }

  _hasSubArray(master, sub) {
    return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));
  };

  _triggerCallback(name) {
    if (!this._subscriptions) { return; }

    this._subscriptions.forEach(subscription => {
      if (subscription.name === '' || this._hasSubArray(name.split('.'), subscription.name.split('.'))) {
        subscription.callback(this.get(name), name);
      }
    });
  }

  _unsubscribe(store) {
    store._subscriptions.forEach((subscription, index) => {
      if (subscription.id === this.id) {
        delete store._subscriptions[index];
      }
    });
  }
}
