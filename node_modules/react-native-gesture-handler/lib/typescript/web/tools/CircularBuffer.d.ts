export default class CircularBuffer<T> {
    private bufferSize;
    private buffer;
    private index;
    private actualSize;
    constructor(size: number);
    get size(): number;
    push(element: T): void;
    get(at: number): T;
    clear(): void;
}
