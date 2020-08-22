import {LinkedMenu} from "./LinkedMenu";

export class LinkedMenuManager {
    private rootMenu: LinkedMenu;
    private onSelectionComplete: (selection: string[]) => void;
    private currentSelection: LinkedMenu;

    public init(rootMenu: LinkedMenu, onSelectionComplete: (selection: string[]) => void): void {
        this.rootMenu = rootMenu;
        this.onSelectionComplete = onSelectionComplete;
        this.selected(rootMenu);
    }

    public selected(menu: LinkedMenu) {
        this.currentSelection = menu;
        this.hideAllChildren(menu);
        if (menu.hasNextMenu()) {
            menu.getNextMenu().show();
        } else {
            this.handleSelectionComplete();
        }
    }

    private hideAllChildren(menu: LinkedMenu) {
        menu.children.forEach((child: LinkedMenu) => {
            child.hide();
            this.hideAllChildren(child);
        });
    }

    private handleSelectionComplete() {
        let selection = [];
        let currentMenu: LinkedMenu = this.rootMenu;
        while (currentMenu !== undefined) {
            let currentValue: string = currentMenu.select.value;
            if (currentValue === "") {
                return;
            }
            selection.push(currentValue);
            currentMenu = currentMenu.getNextMenu();
        }
        this.onSelectionComplete(selection);
    }

    public refireLastSelection(): void {
        this.selected(this.currentSelection);
    }
}