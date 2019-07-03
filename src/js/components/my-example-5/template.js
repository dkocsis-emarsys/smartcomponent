import { html } from 'lighterhtml';

export default component => html`
  <div class="my-example-5__name">
    Hello, <b>${component._state.get('name')}</b>
    <p>You are <b>${component._globalState.get('example5.age')}</b> years old.</p>
  </div>
`;
