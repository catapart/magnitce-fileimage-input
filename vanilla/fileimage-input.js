// fileimage-input.css?raw
var fileimage_input_default = '\r\n:host \r\n{ \r\n    display: inline-grid;\r\n    grid-template-columns: 1fr auto;\r\n    gap: .25em;\r\n    min-height: 34px;\r\n\r\n    /* user-agent input defaults */\r\n    --border-color: rgb(118, 118, 118);\r\n\r\n    /* slotted elements can inherit this for easy color matching */\r\n    --placeholder-color: #757575;\r\n}\r\n@media (prefers-color-scheme: dark) \r\n{\r\n    :host\r\n    {\r\n      --border-color: rgb(133, 133, 133);\r\n    }\r\n}\r\n\r\n/* block styles */\r\n:host(.block)\r\n{\r\n    grid-template-columns: 1fr 1fr;\r\n}\r\n:host(.block) [part="label"]\r\n{\r\n    grid-column: span 2;\r\n    grid-row: 1;\r\n}\r\n:host(.block) [part="field"]\r\n{\r\n    border: dashed 1px #666;\r\n    display: grid;\r\n    gap: .5em;\r\n    justify-items: center;\r\n}\r\n:host(.block) [part="preview"]\r\n{\r\n    height: 70px;\r\n}\r\n:host(.block) [part="placeholder-icon"]\r\n{\r\n    font-size: 3em;\r\n}\r\n:host(.block) [part="clear"]\r\n{\r\n    grid-column: 1;\r\n    grid-row: 2;\r\n}\r\n:host(.block) [part="view-link"]\r\n{\r\n    grid-column: 2;\r\n    grid-row: 2;\r\n    justify-self: flex-end;\r\n}\r\n/* end block styles */\r\n\r\ninput\r\n{\r\n    display: none;\r\n}\r\n\r\n[part="label"]\r\n{\r\n    flex: 1;\r\n    display: flex;\r\n    grid-row: span 2;\r\n    grid-column: 1;\r\n    overflow: hidden;\r\n}\r\n\r\n[part="field"]\r\n{\r\n    flex: 1;\r\n    white-space: nowrap;\r\n\r\n    box-sizing: border-box;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: .25em;\r\n    padding: .25em .5em;\r\n\r\n    background-color: field;\r\n    color: fieldtext;\r\n\r\n    font-size: 13.33px;\r\n    border-width: 1px;\r\n    border-style: solid;\r\n    border-color: var(--border-color);\r\n    border-radius: 2px;\r\n    overflow: hidden;\r\n    min-width: 0;\r\n\r\n}\r\n[part="field"]:focus-visible\r\n,[part="field"]:focus\r\n{\r\n    outline: solid 2px;\r\n    border-radius: 3px;\r\n}\r\n\r\n[part="status"]\r\n{\r\n    overflow: hidden;\r\n}\r\n\r\n[part="preview"][src=""]\r\n,[part="preview"]:not([src])\r\n{\r\n    display: none;\r\n}\r\n[part="preview"]\r\n{\r\n    height: 1em;\r\n}\r\n\r\n[part="view-link"][href="#"]\r\n{\r\n    display: none;\r\n}\r\n[part="view-link"]\r\n{\r\n    white-space: nowrap;\r\n    font-size: .75em;\r\n    grid-column: 2;\r\n    grid-row: 2;\r\n    align-self: center;\r\n}\r\n\r\n[part="thumbnail"]\r\n{\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n[part="placeholder-label"]\r\n,[part="placeholder-icon"]\r\n,::slotted([slot="placeholder"])\r\n,::slotted([slot="placeholder-icon"])\r\n{\r\n    color: var(--placeholder-color);\r\n}\r\n:host([specified]) [part="placeholder-label"]\r\n,:host([specified].image) [part="placeholder-icon"]\r\n,:host([specified]) ::slotted([slot="placeholder"])\r\n,:host([specified].image) ::slotted([slot="placeholder-icon"])\r\n{\r\n    display: none;\r\n}\r\n\r\n[part="clear"]\r\n{\r\n    display: none;\r\n    white-space: nowrap;\r\n    font-size: .75em;\r\n    grid-column: 2;\r\n    grid-row: 1;\r\n    align-self: center;\r\n}\r\n:host([specified]) [part="clear"]\r\n{\r\n    display: block;\r\n}';

// fileimage-input.html?raw
var fileimage_input_default2 = '<label part="label" tabindex="0">\r\n    <input type="file" part="input" />\r\n    <span part="field">\r\n        <span part="thumbnail">\r\n            <slot name="placeholder-icon"><span part="placeholder-icon">\u{1F5CE}</span></slot>\r\n            <img alt="image preview" title="Image Preview" part="preview" />\r\n        </span>\r\n        <span part="status">\r\n            <span part="filename"></span>\r\n            <slot name="placeholder"><span part="placeholder-label"></span></slot>\r\n        </span>\r\n    </span>\r\n</label>\r\n<a href="" part="clear" tabindex="0"><slot name="clear">Clear Selection</slot></a>\r\n<a href="#" target="_blank" part="view-link" tabindex="0"><slot name="view-link">View Selection</slot></a>';

// fileimage-input.ts
var COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(fileimage_input_default);
var COMPONENT_TAG_NAME = "fileimage-input";
var FileImageInputElement = class extends HTMLElement {
  componentParts = /* @__PURE__ */ new Map();
  getPart(key) {
    if (this.componentParts.get(key) == null) {
      const part = this.shadowRoot.querySelector(`[part="${key}"]`);
      if (part != null) {
        this.componentParts.set(key, part);
      }
    }
    return this.componentParts.get(key);
  }
  findPart(key) {
    return this.shadowRoot.querySelector(`[part="${key}"]`);
  }
  get files() {
    return this.findPart("input").files;
  }
  #previewURL;
  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#internals.role = "file";
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = fileimage_input_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.findPart("label").tabIndex = 0;
    const placeholderLabel = this.findPart("placeholder-label");
    if (placeholderLabel != null) {
      placeholderLabel.textContent = this.getAttribute("placeholder") ?? "Select a file...";
    }
    this.updateFormStatus();
    const input = this.findPart("input");
    input.addEventListener("input", () => {
      const value = input.files == null ? null : input.files[0];
      this.updateFormStatus();
      this.updatePreview(value);
      this.dispatchEvent(new Event("change"));
    });
    this.addEventListener("keydown", (event) => {
      if (event.code == "Space" || event.code == "Enter" || event.code == "NumpadEnter") {
        this.findPart("input").click();
        event.preventDefault();
        event.stopPropagation();
      }
    });
    this.findPart("clear").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.value = null;
      this.dispatchEvent(new Event("change"));
      return false;
    });
    this.findPart("clear").addEventListener("keydown", (event) => {
      if (event.code == "Space" || event.code == "Enter" || event.code == "NumpadEnter") {
        event.preventDefault();
        event.stopPropagation();
        this.value = null;
        this.dispatchEvent(new Event("change"));
        return false;
      }
    });
    this.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    this.addEventListener("drop", (event) => {
      event.preventDefault();
      if (event.dataTransfer == null) {
        return;
      }
      const accepted = this.findPart("input").getAttribute("accept").split(",").map((item) => item.trim());
      if (event.dataTransfer.items) {
        const dataItems = [...event.dataTransfer.items];
        for (let i = 0; i < dataItems.length; i++) {
          const item = dataItems[i];
          if (item.kind == "file") {
            const file = item.getAsFile();
            if (file == null) {
              this.value = file;
              return;
            }
            if (accepted.indexOf(file.type) > -1) {
              this.value = file;
            } else {
              this.dispatchEvent(new CustomEvent("deny", { detail: {
                file,
                message: "File type disallowed by accepted list",
                accepted
              } }));
            }
          }
        }
      } else {
        const dataFiles = [...event.dataTransfer.files];
        for (let i = 0; i < dataFiles.length; i++) {
          const file = dataFiles[i];
          if (file == null) {
            this.value = file;
            return;
          }
          if (accepted.indexOf(file.type) > -1) {
            this.value = file;
          } else {
            this.dispatchEvent(new CustomEvent("deny", { detail: {
              file,
              message: "File type disallowed by accepted list",
              accepted
            } }));
          }
        }
      }
    });
  }
  connectedCallback() {
    this.updateFormStatus();
    this.updatePreview(this.value);
  }
  // custom elements reference
  static observedAttributes = ["accept"];
  attributeChangedCallback(attributeName, _oldValue, newValue) {
    if (attributeName == "accept") {
      this.findPart("input").setAttribute("accept", newValue);
    }
  }
  updatePreview(file) {
    if (file == null) {
      this.findPart("preview").removeAttribute("src");
      this.findPart("view-link").href = "#";
      this.findPart("filename").textContent = "";
      this.removeAttribute("specified");
      this.classList.remove("file", "image");
      const placeholderLabel = this.findPart("placeholder-label");
      if (placeholderLabel != null) {
        placeholderLabel.textContent = this.getAttribute("placeholder") ?? "Select a file...";
      }
      if (this.#previewURL != null) {
        window.URL.revokeObjectURL(this.#previewURL);
        this.#previewURL = void 0;
      }
      return;
    }
    this.findPart("filename").textContent = file.name;
    this.toggleAttribute("specified", true);
    if (file.type.startsWith("image")) {
      this.classList.add("image");
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        const result = event.target?.result;
        this.findPart("preview").src = result;
      });
      reader.readAsDataURL(file);
    } else {
      this.classList.add("file");
    }
    this.#previewURL = window.URL.createObjectURL(file);
    this.findPart("view-link").href = this.#previewURL;
  }
  ///// Form Functionality ///// 
  static formAssociated = true;
  // this allows form event functionality;
  #internals;
  // #defaultValue: null = null;
  get value() {
    const input = this.findPart("input");
    return input.files == null ? null : input.files[0];
  }
  set value(val) {
    const transfer = new DataTransfer();
    if (val != null) {
      transfer.items.add(val);
    }
    const input = this.findPart("input");
    input.files = transfer.files;
    this.updateFormStatus();
    this.updatePreview(input.files == null ? null : input.files[0]);
  }
  get validity() {
    return this.#internals.validity;
  }
  #validationMessage = "Please fill out this field.";
  get validationMessage() {
    return this.#validationMessage;
  }
  setCustomValidity(value) {
    this.#validationMessage = value;
    const input = this.findPart("input");
    const formValue = input.files == null ? null : input.files[0];
    this.#internals.setValidity(
      { valueMissing: this.getAttribute("required") != null && formValue == null },
      this.#validationMessage,
      this.findPart("label")
    );
  }
  formDisabledCallback(disabled) {
    this.findPart("input").disabled = disabled;
  }
  formResetCallback() {
    this.value = null;
  }
  checkValidity() {
    return this.#internals.checkValidity();
  }
  reportValidity() {
    return this.#internals.reportValidity();
  }
  updateFormStatus() {
    const input = this.findPart("input");
    const formValue = input.files == null ? null : input.files[0];
    this.#internals.setValidity(
      { valueMissing: this.getAttribute("required") != null && formValue == null },
      this.#validationMessage,
      this.findPart("label")
    );
    this.#internals.setFormValue(formValue);
  }
};
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, FileImageInputElement);
}
export {
  FileImageInputElement
};
