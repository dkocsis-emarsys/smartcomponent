export default class NodeCollection {
  constructor() {
    this._items = [];
  }

  get(type = '') {
    if (!type) { return this._items.map(item => item); }

    return this._items.filter(item => item.element.nodeName === type.toUpperCase());
  }

  upsert(id, element, state, idKey = 'id') {
    const storedItem = this._items.find(storedItem => storedItem[idKey] === id);

    if (storedItem) {
      const itemIndex = this._items.indexOf(storedItem);
      this._items[itemIndex] = {id, element, state};
    } else {
      this._items.push({id, element, state});
    }
  }

  remove(id, element, state, idKey = 'id') {
    this._items = this._items.filter(storedItem => storedItem[idKey] !== id);
  }
}
