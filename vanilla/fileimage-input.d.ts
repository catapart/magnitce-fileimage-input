declare class FileImageInputElement extends HTMLElement {
    #private;
    componentParts: Map<string, HTMLElement>;
    getPart<T extends HTMLElement = HTMLElement>(key: string): T;
    findPart<T extends HTMLElement = HTMLElement>(key: string): T;
    get files(): FileList | null;
    constructor();
    connectedCallback(): void;
    static observedAttributes: string[];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string): void;
    updatePreview(file: File | null): void;
    static formAssociated: boolean;
    get value(): File | null;
    set value(val: File | null);
    get validity(): ValidityState;
    get validationMessage(): string;
    setCustomValidity(value: string): void;
    formDisabledCallback(disabled: boolean): void;
    formResetCallback(): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    updateFormStatus(): void;
}

export { FileImageInputElement };
