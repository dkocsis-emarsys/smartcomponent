const optionTemplate = (html, component, option) => html`
  <div
    class="${option.state.value === component._state.get('value') ? 'bold' : ''}"
    data-handler="option"
    onclick="${component}"
    data-content="${option.state.content}"
    data-value="${option.state.value}">${option.state.content}
  </div>
`;

export default (html, component) => html`
  <div class="popup">
    ${component._state.get('options').map(option => optionTemplate(html, component, option))}
  </div>
`;
