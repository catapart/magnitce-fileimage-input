// fileimage-input.css?raw
var fileimage_input_default = '\n:host \n{ \n    display: inline-grid;\n    grid-template-columns: 1fr auto;\n    gap: .25em;\n    min-height: 34px;\n\n    /* user-agent input defaults */\n    --border-color: rgb(118, 118, 118);\n\n    /* slotted elements can inherit this for easy color matching */\n    --placeholder-color: #757575;\n}\n@media (prefers-color-scheme: dark) \n{\n    :host\n    {\n      --border-color: rgb(133, 133, 133);\n    }\n}\n\n/* block styles */\n:host(.block)\n{\n    grid-template-columns: 1fr 1fr;\n}\n:host(.block) [part="label"]\n{\n    grid-column: span 2;\n    grid-row: 1;\n}\n:host(.block) [part="field"]\n{\n    border: dashed 1px #666;\n    display: grid;\n    gap: .5em;\n    justify-items: center;\n}\n:host(.block) [part="preview"]\n{\n    height: 70px;\n}\n:host(.block) [part="placeholder-icon"]\n{\n    font-size: 3em;\n}\n:host(.block) [part="clear"]\n{\n    grid-column: 1;\n    grid-row: 2;\n}\n:host(.block) [part="view-link"]\n{\n    grid-column: 2;\n    grid-row: 2;\n    justify-self: flex-end;\n}\n/* end block styles */\n\ninput\n{\n    display: none;\n}\n\n[part="label"]\n{\n    flex: 1;\n    display: flex;\n    grid-row: span 2;\n    grid-column: 1;\n    overflow: hidden;\n}\n\n[part="field"]\n{\n    flex: 1;\n    white-space: nowrap;\n\n    box-sizing: border-box;\n    display: inline-flex;\n    align-items: center;\n    gap: .25em;\n    padding: .25em .5em;\n\n    background-color: field;\n    color: fieldtext;\n\n    font-size: 13.33px;\n    border-width: 1px;\n    border-style: solid;\n    border-color: var(--border-color);\n    border-radius: 2px;\n    overflow: hidden;\n    min-width: 0;\n\n}\n[part="field"]:focus-visible\n,[part="field"]:focus\n{\n    outline: solid 2px;\n    border-radius: 3px;\n}\n\n[part="status"]\n{\n    overflow: hidden;\n}\n\n[part="preview"][src=""]\n,[part="preview"]:not([src])\n{\n    display: none;\n}\n[part="preview"]\n{\n    height: 1em;\n}\n\n[part="view-link"][href="#"]\n{\n    display: none;\n}\n[part="view-link"]\n{\n    white-space: nowrap;\n    font-size: .75em;\n    grid-column: 2;\n    grid-row: 2;\n    align-self: center;\n}\n\n[part="thumbnail"]\n{\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n[part="placeholder-label"]\n,[part="placeholder-icon"]\n,::slotted([slot="placeholder"])\n,::slotted([slot="placeholder-icon"])\n{\n    color: var(--placeholder-color);\n}\n:host([specified]) [part="placeholder-label"]\n,:host([specified].image) [part="placeholder-icon"]\n,:host([specified]) ::slotted([slot="placeholder"])\n,:host([specified].image) ::slotted([slot="placeholder-icon"])\n{\n    display: none;\n}\n\n[part="clear"]\n{\n    display: none;\n    white-space: nowrap;\n    font-size: .75em;\n    grid-column: 2;\n    grid-row: 1;\n    align-self: center;\n}\n:host([specified]) [part="clear"]\n{\n    display: block;\n}';

// fileimage-input.html?raw
var fileimage_input_default2 = '<label part="label" tabindex="0">\n    <input type="file" part="input text" />\n    <span part="field text">\n        <span part="thumbnail">\n            <slot name="placeholder-icon"><span part="placeholder-icon">\u{1F5CE}</span></slot>\n            <img alt="image preview" title="Image Preview" part="preview" />\n        </span>\n        <span part="status">\n            <span part="filename"></span>\n            <slot name="placeholder"><span part="placeholder-label"></span></slot>\n        </span>\n    </span>\n</label>\n<a href="" part="clear" tabindex="0"><slot name="clear">Clear Selection</slot></a>\n<a href="#" target="_blank" part="view-link" tabindex="0"><slot name="view-link">View Selection</slot></a>';

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
