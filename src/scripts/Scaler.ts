export interface Scaler {
    scale(value: number): number;

    unscale(value: number): number;
}