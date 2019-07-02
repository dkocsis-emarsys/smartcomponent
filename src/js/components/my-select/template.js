import { html } from 'lighterhtml';

const optionElement = (state, option) => {
  const className = [
    'my-select-option',
    ...(state.selectedOption && option.value === state.selectedOption.value ? ['my-select-option--active'] : []),
  ];

  return html`
    <div class=${className.join(' ')} value=${option.value} onclick=${option.events.click}>${option.content}</div>
  `;
}

export default state => () => html`${state.items ? state.items.map(option => optionElement(state, option)) : ''}`;
