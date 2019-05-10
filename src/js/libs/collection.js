export default class Collection {
  constructor() {
    this._items = [];
  }

  get() {
    return this._items;
  }

  upsert(value, idKey = 'id') {
    const storedItem = this._items.find(storedItem => storedItem[idKey] === value[idKey]);

    if (storedItem) {
      const itemIndex = this._items.indexOf(storedItem);
      this._items[itemIndex] = value;
    } else {
      this._items.push(value);
    }
  }

  remove(id, idKey = 'id') {
    this._items = this._items.filter(storedItem => storedItem[idKey] !== id);
  }
}
