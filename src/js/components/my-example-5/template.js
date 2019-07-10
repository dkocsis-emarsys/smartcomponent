import { html } from 'lighterhtml';

export default component => () => html`
  <div class="my-example-5__name">
    Hello, <b>${component._state.get('name') || component._state.getDefaultValue('name')}</b>
    <p>You are <b>${component._globalState.get('example5.age')}</b> years old.</p>
  </div>

  <input data-handler="name" value="${component._state.get('name')}" placeholder="Name" oninput=${component}>
  <input data-handler="age" type="number" value="${component._globalState.get('example5.age')}" placeholder="Age" oninput=${component}>
`;
