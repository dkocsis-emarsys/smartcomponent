const optionTemplate = function(html, option) {
  return html`
    <div
      class="${option.state.value === this._state.get('selectedOption.value') ? 'bold' : ''}"
      data-value="${option.state.value}"
      data-handler="option" onclick="${this}"
    >${option.state.content()}</div>
  `;
};

export default function(html) {
  return html`
    <div class="popup">
      ${this._state.get('options').map(option => optionTemplate.call(this, html, option))}
    </div>
  `;
};
