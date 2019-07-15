describe('my-example-1', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('my-example-1');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.parentNode.removeChild(component);
  });

  it('render basic template', () => {
    expect(component.innerHTML.replace(/<\!--.*?-->/g, '')).to.equal('The value is: <b>undefined</b>');
  });

  it('render value in template set by property', () => {
    component.value = 2;
    expect(component.textContent).to.equal('The value is: 2');
  });

  it('render value in template set by attribute', () => {
    component.setAttribute('value', 2);
    expect(component.textContent).to.equal('The value is: 2');
  });

  it('rerender component on value change', () => {
    component.value = 2;
    component.value = 3;
    expect(component.textContent).to.equal('The value is: 3');
  });
});
