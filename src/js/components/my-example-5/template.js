import { html } from 'lighterhtml';

export default (state, globalState) => () => {
  return html`
  <div class="my-example-5__name">
    Hello, <b>${state.get('name')}</b>
    <p>You are <b>${globalState.get('example5.age')}</b> years old.</p>
  </div>
`;
}