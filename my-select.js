const currentScript = document.currentScript;

const title = currentScript.dataset.title || 'Заголовок по умолчанию';
const color = currentScript.dataset.color || 'steelblue';

class MySelect extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
          <div style="padding: 1em; border-radius: 8px; background: ${color}; color: white;">
            <h2>${title}</h2>
            <p>Контент внутри элемента </p>
          </div>
        `;
  }
}
// Регистрируем элемент
customElements.define('my-select', MySelect);
