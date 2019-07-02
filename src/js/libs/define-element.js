const defineElement = (componentClass, dependencies = []) => {
  const classNameMatch = componentClass.toString().match(/^function\s*([^\s(]+)|^class\s*([^\s(]+)/);
  const className = classNameMatch[1] || classNameMatch[2];
  const tag = className.replace(/([a-zA-Z0-9])(?=[A-Z0-9])/g, '$1-').toLowerCase();

  customElements.define(tag, componentClass);

  dependencies.forEach(dependency => defineElement(dependency));
};

export default defineElement;
