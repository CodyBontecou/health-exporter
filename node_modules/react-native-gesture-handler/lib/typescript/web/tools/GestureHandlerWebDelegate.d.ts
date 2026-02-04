import type IGestureHandler from '../handlers/IGestureHandler';
import { GestureHandlerDelegate, MeasureResult } from './GestureHandlerDelegate';
import { Config } from '../interfaces';
export declare class GestureHandlerWebDelegate implements GestureHandlerDelegate<HTMLElement, IGestureHandler> {
    private isInitialized;
    private view;
    private gestureHandler;
    private eventManagers;
    private defaultViewStyles;
    getView(): HTMLElement;
    init(viewRef: number, handler: IGestureHandler): void;
    isPointerInBounds({ x, y }: {
        x: number;
        y: number;
    }): boolean;
    measureView(): MeasureResult;
    reset(): void;
    tryResetCursor(): void;
    private shouldDisableContextMenu;
    private addContextMenuListeners;
    private removeContextMenuListeners;
    private disableContextMenu;
    private enableContextMenu;
    private setUserSelect;
    private setTouchAction;
    private setContextMenu;
    onEnabledChange(enabled: boolean): void;
    onBegin(): void;
    onActivate(): void;
    onEnd(): void;
    onCancel(): void;
    onFail(): void;
    destroy(config: Config): void;
}
