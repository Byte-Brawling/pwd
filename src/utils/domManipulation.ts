// src/utils/domManipulation.ts
export const domManipulation = {
    createElement: <K extends keyof HTMLElementTagNameMap>(
        tag: K,
        attributes: Record<string, string> = {},
        children: (string | Node)[] = []
    ): HTMLElementTagNameMap[K] => {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        children.forEach((child) => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    },

    removeElement: (element: HTMLElement): void => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    addClass: (element: HTMLElement, className: string): void => {
        element.classList.add(className);
    },

    removeClass: (element: HTMLElement, className: string): void => {
        element.classList.remove(className);
    },

    toggleClass: (element: HTMLElement, className: string): void => {
        element.classList.toggle(className);
    },

    setStyle: (element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void => {
        Object.assign(element.style, styles);
    },

    getComputedStyle: (element: HTMLElement, property: keyof CSSStyleDeclaration): string => {
        return window.getComputedStyle(element)[property] as string;
    },

    addEventListenerWithCleanup: <K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        type: K,
        listener: (event: HTMLElementEventMap[K]) => void
    ): () => void => {
        element.addEventListener(type, listener);
        return () => element.removeEventListener(type, listener);
    },
};