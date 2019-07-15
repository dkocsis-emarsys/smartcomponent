describe('my-example-3', () => {
  let component;
  let childComponent;

  beforeEach(() => {
    component = document.createElement('my-example-2');
    childComponent = document.createElement('my-example-2-child');
    component.appendChild(childComponent);
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.parentNode.removeChild(component);
  });

  it('render basic template', () => {
    expect(component.innerHTML.replace(/<\!--.*?-->/g, '')).to.equal('<my-example-2-child></my-example-2-child><div class="my-example-2-value">Value of the child component is: <b>undefined</b></div>');
  });

  it('set value on child renders in template', done => {
    childComponent.value = 2;

    requestAnimationFrame(() => {
      expect(component.textContent).to.equal('Value of the child component is: 2');
      done();
    });
  });

  it('rerender component on value change', done => {
    childComponent.value = 2;
    childComponent.value = 3;

    requestAnimationFrame(() => {
      expect(component.textContent).to.equal('Value of the child component is: 3');
      done();
    });
  });
});
