class MyPanel extends HTMLElement {
  constructor() {
    super();
  }

  #shadow;

  connectedCallback() {
    this.#shadow = this.attachShadow({ mode: 'open' });
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
        margin: 0;
        font-size: 1rem;
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

  #header(style) {
    const container = document.createElement('div');
    container.classList.add('panel');
    const header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = `
      <h3>${this.getAttribute('header') || 'Panel'}</h3>
      <span class="toggle-icon">&#9660</span>
    `;

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
}

customElements.define('my-panel', MyPanel);
