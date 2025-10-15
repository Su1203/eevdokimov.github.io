class MySelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const options = Array.from(this.querySelectorAll('option'));

    const optionsObject = {};
    options.forEach((opt) => {
      optionsObject[opt.value] = opt.textContent;
    });

    const optionsContainer = this.#renderOptions(optionsObject);

    options.forEach((opt) => opt.remove());

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.append(optionsContainer);
  }

  #renderOptions(optionsObj) {
    const template = document.createElement('template');

    console.log('тут', optionsObj);

    //HTML
    const optionsHTML = Object.entries(optionsObj)
      .map(
        ([value, text]) => `
      <label class="option" data-value="${value}">
        <input type="checkbox" />
        ${text}
      </label>
    `
      )
      .join('');

    template.innerHTML = `      
      <div class="select-popup-options">
        ${optionsHTML}
      </div>
    `;

    return template.content.cloneNode(true);
  }
}
// Регистрируем элемент
customElements.define('my-select', MySelect);
