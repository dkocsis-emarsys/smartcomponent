const defineElement = (componentClass, dependencies = []) => {
  const classNameMatch = componentClass.toString().match(/^function\s*(?<function>[^\s(]+)|^class\s*(?<class>[^\s(]+)/);
  const className = classNameMatch.groups.class || classNameMatch.groups.function;
  const tag = className.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

  customElements.define(tag, componentClass);

  dependencies.forEach(dependency => defineElement(dependency));
};

export default defineElement;
