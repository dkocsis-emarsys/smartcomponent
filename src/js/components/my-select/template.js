import { html } from 'lighterhtml';

const optionElement = (state, option) => {
  const className = [
    'my-option',
    ...(state.selectedOption && option.value === state.selectedOption.data.value ? ['my-option--active'] : []),
  ];

  return html`
    <div class=${className.join(' ')} value=${option.value} onclick=${option.events.click}>${option.content}</div>
  `;
}

export default state => () => html`${state.items.map(option => optionElement(state, option))}`;
