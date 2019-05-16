import 'document-register-element';
import 'classlist-polyfill';

const defineElement = (componentClass, dependencies = []) => {
  const tag = componentClass.name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

  customElements.define(tag, componentClass);

  dependencies.forEach(dependency => defineElement(dependency));
};

import MySelect from './components/my-select';
import MyOption from './components/my-option';

defineElement(MySelect, [MyOption]);
