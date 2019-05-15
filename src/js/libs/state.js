import Symbol from 'es6-symbol';

const isMergeableObject = val => {
  const nonNullObject = val && typeof val === 'object';

  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]';
};

const emptyTarget = val => {
  return Array.isArray(val) ? [] : {};
};

const cloneIfNecessary = (value, optionsArgument) => {
  const clone = optionsArgument && optionsArgument.clone === true;
  return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value;
};

const defaultArrayMerge = (target, source, optionsArgument) => {
  var destination = target.slice();

  source.forEach((e, i) => {
    if (typeof destination[i] === 'undefined') {
      destination[i] = cloneIfNecessary(e, optionsArgument);
    } else if (isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument);
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e, optionsArgument));
    }
  });

  return destination;
};

const mergeObject = (target, source, optionsArgument) => {
    var destination = {};

    if (isMergeableObject(target)) {
      Object.keys(target).forEach(function (key) {
        destination[key] = cloneIfNecessary(target[key], optionsArgument);
      });
    }

    Object.keys(source).forEach(function (key) {
      if (!isMergeableObject(source[key]) || !target[key]) {
        destination[key] = cloneIfNecessary(source[key], optionsArgument);
      } else {
        destination[key] = deepmerge(target[key], source[key], optionsArgument);
      }
    });

    return destination;
};

const deepmerge = (target, source, optionsArgument) => {
  const array = Array.isArray(source);
  const options = optionsArgument || { arrayMerge: defaultArrayMerge };
  const arrayMerge = options.arrayMerge || defaultArrayMerge;

  if (array) {
    return Array.isArray(target) ?
      arrayMerge(target, source, optionsArgument) :
      cloneIfNecessary(source, optionsArgument);
  } else {
    return mergeObject(target, source, optionsArgument);
  }
};

const hasSubArray = (master, sub) => {
  return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));
};

export default class State {
  constructor(defaultData = {}, renderFunction = () => {}) {
    this._defaultData = defaultData;
    this._data = deepmerge({}, this._defaultData);
    this._renderFunction = renderFunction;
    this._subscriptions = [];
  }

  _get(name) {
    return name.split('.').reduce((item, index) => item ? item[index] : false, this._data);
  }

  get(name) {
    if (name) { return this._get(`component.${name}`); }

    return this._get(`component`);
  }

  getOption(name) {
    if (name) { return this._get(`options.${name}`); }

    return this._get(`options`);
  }

  _set(name, value, options = {}) {
    const modifiedData = name.split('.').reduceRight((previous, current) => ({ [current]: previous }), value);

    this._data = deepmerge(this._data, modifiedData);

    if (options.triggerCallback === undefined || options.triggerCallback) { this._triggerCallback(name); }
    if (options.triggerRender === undefined || options.triggerRender) { this._renderFunction(); }

    return value;
  }

  _setMultiple(type, list, options = {}) {
    Object.keys(list).forEach(element => {
      this._set(`${type}.${element}`, list[element], { triggerRender: false });
    });

    if (options.triggerRender === undefined || options.triggerRender) { this._renderFunction(); }
  }

  set(name, value, options = {}) {
    this._set(`component.${name}`, value, options);
  }

  setMultiple(list, options = {}) {
    this._setMultiple('component', list, options);
  }

  setOption(name, value, options = {}) {
    options.triggerRender = false;
    this._set(`options.${name}`, value, options);
  }

  setMultipleOption(list, options = {}) {
    this._setMultiple('options', list, options);
  }

  render() {
    this._renderFunction();
  }

  _subscribe(name, callback) {
    const subscription = {
      id: Symbol(),
      name: name,
      callback: callback
    };

    this._subscriptions.push(subscription);

    return { unsubscribe: this._unsubscribe.bind(subscription, this) };
  }

  subscribe(name, callback) {
    if (name) { return this._subscribe(`component.${name}`, callback); }

    return this._subscribe(`component`, callback);
  }

  subscribeOption(name, callback) {
    if (name) { return this._subscribe(`options.${name}`, callback); }

    return this._subscribe(`options`, callback);
  }

  _unsubscribeAll(name) {
    this._subscriptions.forEach((subscription, index) => {
      if (subscription.name === name) {
        delete this._subscriptions[index];
      }
    });
  }

  unsubscribeAll(name) {
    this._unsubscribeAll(`component.${name}`);
  }

  unsubscribeAllOption(name) {
    this._unsubscribeAll(`options.${name}`);
  }

  _triggerChange(name) {
    this._triggerCallback(name);
  }

  triggerChange(name) {
    this._triggerChange(`component.${name}`);
  }

  triggerOptionChange(name) {
    this._triggerChange(`options.${name}`);
  }

  _triggerCallback(name) {
    if (!this._subscriptions) { return; }

    this._subscriptions.forEach(subscription => {
      if (hasSubArray(name.split('.'), subscription.name.split('.'))) {
        subscription.callback(this._get(name), name);
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
