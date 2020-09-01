import * as tfvis from "@tensorflow/tfjs-vis";

export abstract class Visor {
    public static init() {
        document.getElementById("show-visor").onclick = () => {
            tfvis.visor();
        }
    }

    public static getFitCallbacks(): any {
        const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
        const container = {
            name: 'show.fitCallbacks',
            tab: 'Training',
            styles: {
                height: '1000px'
            }
        };
        return tfvis.show.fitCallbacks(container, metrics);
        // return train(model, data, callbacks);
    }
}

