import {LinkedMenuManager} from "./LinkedMenuManager";
import {LinkedMenu} from "./LinkedMenu";
import {RegressionJS} from "./RegressionJS";
import {DefaultModels} from "./DefaultModels";
import {chart, doFit, showForecastAndBacktests} from "./index";
import {NNModel} from "./NNModel";

export const menuManager: LinkedMenuManager = new LinkedMenuManager();

let defaultMethodSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("default_method");
let defaultMethodMenu: LinkedMenu = new LinkedMenu(defaultMethodSelect, new Map<string, LinkedMenu>());
defaultMethodSelect.onchange = () => menuManager.selected(defaultMethodMenu);

let orderSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("order");
let orderMenu: LinkedMenu = new LinkedMenu(orderSelect, new Map<string, LinkedMenu>());
orderSelect.onchange = () => menuManager.selected(orderMenu);

let regressionJSMethodSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("regression-js_method");
let regressionJSMethodMenu: LinkedMenu = new LinkedMenu(regressionJSMethodSelect, new Map<string, LinkedMenu>([
    ["polynomial", orderMenu]
]));
regressionJSMethodSelect.onchange = () => menuManager.selected(regressionJSMethodMenu);

let tensorflowMethodSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("tensorflow");
let tensorflowMethodMenu: LinkedMenu = new LinkedMenu(tensorflowMethodSelect, new Map<string, LinkedMenu>());
tensorflowMethodSelect.onchange = () => menuManager.selected(tensorflowMethodMenu);

let providerSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("provider");
let providerMenu = new LinkedMenu(providerSelect, new Map<string, LinkedMenu>([
    ["default", defaultMethodMenu],
    ["regression-js", regressionJSMethodMenu],
    ["tensorflow", tensorflowMethodMenu]
]));

providerSelect.onchange = () => menuManager.selected(providerMenu);
menuManager.init(providerMenu, doSelection);

function doSelection(selection: string[]) {
    let points = chart.getData();
    if (selection[0] === "regression-js") {
        let modelSupplier = RegressionJS.getModelSupplier(selection.slice(1));
        showForecastAndBacktests(points, modelSupplier);
    } else if (selection[0] === "default") {
        let modelSupplier = DefaultModels.getModelSupplier(selection.slice(1));
        showForecastAndBacktests(points, modelSupplier);
    } else if (selection[0] === "tensorflow") {
        let modelSupplier = NNModel.getModelSupplier(selection.slice(1));
        doFit(points, modelSupplier);
    }
}