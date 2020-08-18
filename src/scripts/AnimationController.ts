export class AnimationController {
    private animationRequestId: number;
    private drawCallback: (currentTimeMillis: DOMHighResTimeStamp) => void;
    private drawEnabled: boolean;

    public enableDraw(drawCallback: (currentTimeMillis: DOMHighResTimeStamp) => void): void {
        this.drawCallback = drawCallback;
        this.drawEnabled = true;
        this.animationRequestId = window.requestAnimationFrame(this.draw.bind(this));
    }

    private draw(currentTimeMillis: DOMHighResTimeStamp) {
        this.drawCallback(currentTimeMillis);
        if (this.drawEnabled) {
            this.animationRequestId = window.requestAnimationFrame(this.draw.bind(this));
        }
    }

    public disableDraw(): void {
        this.drawEnabled = false;
        window.cancelAnimationFrame(this.animationRequestId);
    }
}