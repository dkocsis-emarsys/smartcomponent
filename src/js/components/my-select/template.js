import { html } from 'lighterhtml';

const optionElement = option => html`
  <div class="my-option" value=${option.value} onclick=${option.events.click}>${option.content}</div>
`;

export default state => () => html`${state.items.map(optionElement)}`;
