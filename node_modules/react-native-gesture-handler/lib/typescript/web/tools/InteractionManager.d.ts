import type IGestureHandler from '../handlers/IGestureHandler';
import { Config } from '../interfaces';
export default class InteractionManager {
    private static instance;
    private readonly waitForRelations;
    private readonly simultaneousRelations;
    private readonly blocksHandlersRelations;
    private constructor();
    configureInteractions(handler: IGestureHandler, config: Config): void;
    shouldWaitForHandlerFailure(handler: IGestureHandler, otherHandler: IGestureHandler): boolean;
    shouldRecognizeSimultaneously(handler: IGestureHandler, otherHandler: IGestureHandler): boolean;
    shouldRequireHandlerToWaitForFailure(handler: IGestureHandler, otherHandler: IGestureHandler): boolean;
    shouldHandlerBeCancelledBy(_handler: IGestureHandler, otherHandler: IGestureHandler): boolean;
    dropRelationsForHandlerWithTag(handlerTag: number): void;
    reset(): void;
    static getInstance(): InteractionManager;
}
