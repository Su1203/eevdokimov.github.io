class MySelect extends HTMLElement {
  constructor() {
    super();
  }

  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #shadow;

  connectedCallback() {
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
        <input placeholder="Search..." />
        <button class="select-button">&#9660</button>              
      </div>      
    `;
    this.#shadow.append(optionsContainer);
    this.#shadow.append(this.#createTemplate());
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
            //position: absolute;
            //top: 100%;
            //left: 0;
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
      </style>      
    `;

    this.#selectPopup = this.#shadow.querySelector('.select-popup');
    this.#selectPopupSearch = this.#shadow.querySelector('.select-popup input');
    this.#optionsBox = this.#shadow.querySelector('.select-popup-options');
    this.#selectButton = this.#shadow.querySelector('.select-button');

    this.#selectButton.addEventListener('click', this.#openPopup.bind(this));
    return template.content.cloneNode(true);
  }

  #openPopup() {
    this.#optionsBox.classList.toggle('open');
  }
}
// Регистрируем элемент
customElements.define('my-select', MySelect);
