import {Drawable} from "./Drawable";
import {Page} from "./Page";

export class Presenter implements Drawable {
    private page: Page;

    public draw(currentTimeMillis: DOMHighResTimeStamp) {
        switch (this.page) {
            case Page.CHART:
                break;
            default:
                throw new Error("Unrecognized page '" + this.page +"'");
        }
        console.log((currentTimeMillis / 1000).toFixed(0));
    }
}