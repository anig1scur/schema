import { ChangeTree } from "../changes/ChangeTree";
import { SchemaDecoderCallbacks } from "../Schema";
import { DataChange } from "..";
export declare function getArrayProxy(value: ArraySchema): ArraySchema<any>;
export declare class ArraySchema<V = any> implements Array<V>, SchemaDecoderCallbacks {
    protected $changes: ChangeTree;
    protected $items: Map<number, V>;
    protected $indexes: Map<number, number>;
    protected $refId: number;
    [n: number]: V;
    $callbacks: {
        [operation: number]: Array<(item: V, key: number) => void>;
    };
    onAdd(callback: (item: V, key: number) => void, triggerAll?: boolean): () => boolean;
    onRemove(callback: (item: V, key: number) => void): () => boolean;
    onChange(callback: (item: V, key: number) => void): () => boolean;
    static is(type: any): boolean;
    constructor(...items: V[]);
    set length(value: number);
    get length(): number;
    push(...values: V[]): number;
    /**
     * Removes the last element from an array and returns it.
     */
    pop(): V | undefined;
    at(index: number): V;
    setAt(index: number, value: V): void;
    deleteAt(index: number): boolean;
    protected $deleteAt(index: any): boolean;
    clear(changes?: DataChange[]): void;
    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    concat(...items: (V | ConcatArray<V>)[]): ArraySchema<V>;
    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;
    /**
     * Reverses the elements in an Array.
     */
    reverse(): ArraySchema<V>;
    /**
     * Removes the first element from an array and returns it.
     */
    shift(): V | undefined;
    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): V[];
    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: V, b: V) => number): this;
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param items Elements to insert into the array in place of the deleted elements.
     */
    splice(start: number, deleteCount?: number, ...items: V[]): V[];
    /**
     * Inserts new elements at the start of an array.
     * @param items  Elements to insert at the start of the Array.
     */
    unshift(...items: V[]): number;
    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    indexOf(searchElement: V, fromIndex?: number): number;
    /**
     * Returns the index of the last occurrence of a specified value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
     */
    lastIndexOf(searchElement: V, fromIndex?: number): number;
    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callbackfn A function that accepts up to three arguments. The every method calls
     * the callbackfn function for each element in the array until the callbackfn returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(callbackfn: (value: V, index: number, array: V[]) => unknown, thisArg?: any): boolean;
    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callbackfn A function that accepts up to three arguments. The some method calls
     * the callbackfn function for each element in the array until the callbackfn returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(callbackfn: (value: V, index: number, array: V[]) => unknown, thisArg?: any): boolean;
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: V, index: number, array: V[]) => void, thisArg?: any): void;
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(callbackfn: (value: V, index: number, array: V[]) => U, thisArg?: any): U[];
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(callbackfn: (value: V, index: number, array: V[]) => unknown, thisArg?: any): V[];
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce<U = V>(callbackfn: (previousValue: U, currentValue: V, currentIndex: number, array: V[]) => U, initialValue?: U): U;
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduceRight<U = V>(callbackfn: (previousValue: U, currentValue: V, currentIndex: number, array: V[]) => U, initialValue?: U): U;
    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: V, index: number, obj: V[]) => boolean, thisArg?: any): V | undefined;
    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: V, index: number, obj: V[]) => unknown, thisArg?: any): number;
    /**
     * Returns the this object after filling the section identified by start and end with value
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: V, start?: number, end?: number): this;
    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;
    /**
     * Returns a string representation of an array.
     */
    toString(): string;
    /**
     * Returns a string representation of an array. The elements are converted to string using their toLocalString methods.
     */
    toLocaleString(): string;
    /** Iterator */
    [Symbol.iterator](): IterableIterator<V>;
    static get [Symbol.species](): typeof ArraySchema;
    [Symbol.unscopables]: any;
    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    entries(): IterableIterator<[number, V]>;
    /**
     * Returns an iterable of keys in the array
     */
    keys(): IterableIterator<number>;
    /**
     * Returns an iterable of values in the array
     */
    values(): IterableIterator<V>;
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: V, fromIndex?: number): boolean;
    /**
     * Calls a defined callback function on each element of an array. Then, flattens the result into
     * a new array.
     * This is identical to a map followed by flat with depth 1.
     *
     * @param callback A function that accepts up to three arguments. The flatMap method calls the
     * callback function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callback function. If
     * thisArg is omitted, undefined is used as the this value.
     */
    flatMap<U, This = undefined>(callback: (this: This, value: V, index: number, array: V[]) => U | ReadonlyArray<U>, thisArg?: This): U[];
    /**
     * Returns a new array with all sub-array elements concatenated into it recursively up to the
     * specified depth.
     *
     * @param depth The maximum recursion depth
     */
    flat<A, D extends number = 1>(this: A, depth?: D): any;
    findLast(): any;
    findLastIndex(...args: any[]): any;
    with(index: number, value: V): ArraySchema<V>;
    toReversed(): V[];
    toSorted(compareFn?: (a: V, b: V) => number): V[];
    toSpliced(start: number, deleteCount: number, ...items: V[]): V[];
    toSpliced(start: number, deleteCount?: number): V[];
    protected setIndex(index: number, key: number): void;
    protected getIndex(index: number): number;
    protected getByIndex(index: number): V;
    protected deleteByIndex(index: number): void;
    toArray(): V[];
    toJSON(): any[];
    clone(isDecoding?: boolean): ArraySchema<V>;
}