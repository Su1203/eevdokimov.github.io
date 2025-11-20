class MyPanel extends HTMLElement {
  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#panel();
  }

  #shadow;
  #headerPanel;
  #subHeaderPanel;
  static observedAttributes = ['header', 'sub-header'];

  #panel() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        overflow: hidden;
        font-family: sans-serif;
      }
      .header {
        background: #f5f5f5;
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        user-select: none;
      }
      .header h3 {
        padding: 0;
        margin: 0;
        font-size: 1rem;
      }
      .sub-header {       
        margin: 0;
        font-size: 0.8rem;
        font-style: italic;
        text-align:left;
      }        
      .content {
        padding: 1rem;
        display: block;
      }
      .collapsed .content {
        display: none;
      }
      .toggle-icon {
        font-size: 0.9rem;
      }
    `;

    this.#header(style);
  }
  connectedCallback() {}

  #header(style) {
    const container = document.createElement('div');
    container.classList.add('panel');
    const header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = `
      <div>
        <h3 class = "header"></h3>
        <h5 class = "sub-header"></h5>
      </div>
      <span class="toggle-icon">&#9660</span>
    `;

    this.#headerPanel = header.querySelector('.header');
    this.#subHeaderPanel = header.querySelector('.sub-header');

    const content = document.createElement('div');
    content.classList.add('content');
    content.innerHTML = `<slot></slot>`;

    header.addEventListener('click', () => {
      container.classList.toggle('collapsed');
      const icon = header.querySelector('.toggle-icon');
      icon.textContent = container.classList.contains('collapsed')
        ? String.fromCharCode(9650)
        : String.fromCharCode(9660);
    });

    container.appendChild(header);
    container.appendChild(content);
    this.#shadow.append(style, container);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'header' && this.#headerPanel) {
      this.#headerPanel.textContent = newValue;
    }
    if (name == 'sub-header' && this.#subHeaderPanel) {
      this.#subHeaderPanel.textContent = newValue;
    }
  }
}

customElements.define('my-panel', MyPanel);
