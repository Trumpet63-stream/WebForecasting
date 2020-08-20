export class LinkedMenu {
    public select: HTMLSelectElement;
    public children: Map<string, LinkedMenu>;

    constructor(select: HTMLSelectElement, children: Map<string, LinkedMenu>) {
        this.select = select;
        this.children = children;
    }

    public hasNextMenu(): boolean {
        return this.children.get(this.select.value) !== undefined;
    }

    public getNextMenu(): LinkedMenu {
        return this.children.get(this.select.value);
    }

    public show() {
        this.select.style.display = "block";
        this.select.labels.forEach((label: HTMLLabelElement) => {
            label.style.display = "block";
        });
    }

    public hide() {
        this.select.style.display = "none";
        this.select.value = "";
        this.select.labels.forEach((label: HTMLLabelElement) => {
            label.style.display = "none";
        });
    }
}