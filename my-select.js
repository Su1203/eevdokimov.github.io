class MySelect extends HTMLElement {
  constructor() {
    super();
  }

  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #shadow;
  #filterInput;
  #slotOptions;

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(val) {
    this.setAttribute('value', val);
  }

  connectedCallback() {
    this._options = [];
    this._selected = new Set();
    const options = Array.from(this.querySelectorAll('option'));
    this.#shadow = this.attachShadow({ mode: 'open' });

    const optionsObject = {};
    options.forEach((opt) => {
      optionsObject[opt.value] = opt.textContent;
    });

    const optionsContainer = this.#renderOptions(optionsObject);
    options.forEach((opt) => opt.remove());
    this.#shadow.innerHTML = `
      <div class="select-popup">
        <slot name="search">
          <input placeholder="Search..." />
        </slot>
        <button class="select-button">&#9660</button>              
      </div>      
    `;
    this.#shadow.append(optionsContainer);
    this.#shadow.append(this.#createTemplate());
    this._initOptions();
    this.#attachEvents();
  }

  _initOptions() {
    this._options = Array.from(this.#slotOptions).map((opt) => {
      const value = opt.value || opt.textContent.trim();
      opt.addEventListener('click', (e) => {
        e.stopPropagation();

        if (this._selected.has(value)) {
          this._selected.delete(value);
        } else {
          this._selected.add(value);
        }
        this._updateValue();
      });

      return {
        label: opt.textContent.trim(),
        value: value,
      };
    });
  }

  #attachEvents() {
    // Фильтрация
    this.#filterInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      this.#slotOptions.forEach((label) => {
        const text = label.textContent.toLowerCase();
        label.style.display = text.includes(term) ? '' : 'none';
      });

      this.#renderOptions;
    });

    // Клик вне селекта — закрыть
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.closeOptionsBox();
      }
    });
  }

  closeOptionsBox() {
    this.#optionsBox.classList.remove('open');
  }

  _updateValue() {
    const values = Array.from(this._selected);
    this.value = values.join(',');
    const labelText = values.length > 0 ? values.join(', ') : '';
    this.#selectPopupSearch.value = labelText;
    this.dispatchEvent(new Event('change'));
  }

  #renderOptions(optionsObj) {
    const template = document.createElement('template');
    const optionsHTML = Object.entries(optionsObj)
      .map(
        ([value, text]) => `
      <label class="option" data-value="${value}">
        <input type="checkbox" />
        ${text}
      </label><br>
    `
      )
      .join('');

    template.innerHTML = `      
      <div class="select-popup-options">       
        <div class = "filter">
          <input type="text" placeholder="Фильтр...">
        </div>
        ${optionsHTML}
      </div>
    `;
    return template.content.cloneNode(true);
  }

  #createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `    
      <style>          
          .select-popup button {
            background: var(--select-popup-background, white);
            border: none;
            padding: 5px;
            cursor: pointer;
          } 
          .select-popup-options{
            display: none;            
          } 
          .select-popup{      
            background: var(--select-popup-background, white);
            display: flex;
            border: 1px solid #aaa;            
          }
  
          .select-popup-options.open{
            display: block;
            
          }          
         :host{
           position: relative;
           display: inline-block;
         }             
         .filter {
          border-bottom: 1px solid #eee;
          padding: 0.5rem;
         }
         .filter input {
            width: 100%;
            padding: 0.4rem;
            border: 1px solid #ccc;
            border-radius: 4px;
         }     
      </style>      
    `;

    this.#selectPopup = this.#shadow.querySelector('.select-popup');
    this.#selectPopupSearch = this.#shadow.querySelector('.select-popup input');
    this.#optionsBox = this.#shadow.querySelector('.select-popup-options');
    this.#selectButton = this.#shadow.querySelector('.select-button');
    this.#filterInput = this.#shadow.querySelector('.filter');
    this.#slotOptions = this.#shadow.querySelectorAll('.option');

    this.#selectButton.addEventListener('click', this.#openPopup.bind(this));
    return template.content.cloneNode(true);
  }

  #openPopup() {
    this.#optionsBox.classList.toggle('open');
  }
}
// Регистрируем элемент
customElements.define('my-select', MySelect);
