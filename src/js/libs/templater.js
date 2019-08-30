import { html, render } from 'lighterhtml';

class Templater {
  constructor(context) {
    this._context = context;
    this._templates = [];
  }

  init(templates) {
    if (typeof templates === 'object') {
      templates.forEach(template => this._templates.push(template));
    } else {
      this._templates = [{
        name: '_default',
        markup: templates,
        container: this._context,
        autoAppendContainer: true
      }];
    }
  }

  connect() {
    this._cleanUpContainer();

    this._templates.forEach(template => {
      if (template.container && template.container !== this._context) {
        template.container.setAttribute('data-render-container', '');

        if (!template.autoAppendContainer) { return; }

        if (template.prepend) {
          this._context.insertAdjacentElement('afterbegin', template.container);
        } else {
          this._context.appendChild(template.container);
        }
      }
    });
  }

  disconnect() {
    this._templates.forEach(template => {
      if (template.container && template.container !== this._context) {
        template.container.parentNode.removeChild(template.container);
      }
    });
  }

  renderAll() {
    this._templates.forEach(template => {
      if (template.markup && template.container) {
        render(template.container, () => template.markup.call(this._context, html));
      }
    });
  }

  render(templateName = '_default') {
    return this._templates.find(template => template.name === templateName).markup.call(this._context, html);
  }

  getContainer(templateName = '_default') {
    return this._templates.find(template => template.name === templateName).container;
  }

  _cleanUpContainer() {
    const containers = this._context.querySelectorAll('[data-render-container]');
    Array.from(containers).forEach(node => node.parentNode.removeChild(node));
  }
}

export default Templater;
