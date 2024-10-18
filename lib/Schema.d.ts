import { OPERATION } from './spec';
import { ClientWithSessionId, Context, SchemaDefinition, DefinitionType } from "./annotations";
import type { Iterator } from "./encoding/decode";
import { ChangeTree, Ref } from "./changes/ChangeTree";
import { NonFunctionPropNames, ToJSON } from './types/HelperTypes';
export interface DataChange<T = any, F = string> {
    refId: number;
    op: OPERATION;
    field: F;
    dynamicIndex?: number | string;
    value: T;
    previousValue: T;
}
export interface SchemaDecoderCallbacks<TValue = any, TKey = any> {
    $callbacks: {
        [operation: number]: Array<(item: TValue, key: TKey) => void>;
    };
    onAdd(callback: (item: any, key: any) => void, ignoreExisting?: boolean): () => void;
    onRemove(callback: (item: any, key: any) => void): () => void;
    onChange(callback: (item: any, key: any) => void): () => void;
    clone(decoding?: boolean): SchemaDecoderCallbacks;
    clear(changes?: DataChange[]): any;
    decode?(byte: any, it: Iterator): any;
}
/**
 * Schema encoder / decoder
 */
export declare abstract class Schema {
    static _typeid: number;
    static _context: Context;
    static _definition: SchemaDefinition;
    static onError(e: any): void;
    static is(type: DefinitionType): boolean;
    protected $changes: ChangeTree;
    protected $callbacks: {
        [op: number]: Array<Function>;
    };
    onChange(callback: () => void): () => void;
    onRemove(callback: () => void): () => void;
    constructor(...args: any[]);
    assign(props: {
        [prop in NonFunctionPropNames<this>]?: this[prop];
    } | ToJSON<this>): this;
    protected get _definition(): SchemaDefinition;
    /**
     * (Server-side): Flag a property to be encoded for the next patch.
     * @param instance Schema instance
     * @param property string representing the property name, or number representing the index of the property.
     * @param operation OPERATION to perform (detected automatically)
     */
    setDirty<K extends NonFunctionPropNames<this>>(property: K | number, operation?: OPERATION): void;
    /**
     * Client-side: listen for changes on property.
     * @param prop the property name
     * @param callback callback to be triggered on property change
     * @param immediate trigger immediatelly if property has been already set.
     */
    listen<K extends NonFunctionPropNames<this>>(prop: K, callback: (value: this[K], previousValue: this[K]) => void, immediate?: boolean): () => boolean;
    decode(bytes: number[], it?: Iterator, ref?: Ref): DataChange<any, string>[];
    encode(encodeAll?: boolean, bytes?: number[], useFilters?: boolean): number[];
    encodeAll(useFilters?: boolean): number[];
    applyFilters(client: ClientWithSessionId, encodeAll?: boolean): number[];
    clone(): this;
    toJSON(): ToJSON<typeof this>;
    discardAllChanges(): void;
    protected getByIndex(index: number): any;
    protected deleteByIndex(index: number): void;
    private tryEncodeTypeId;
    private getSchemaType;
    private createTypeInstance;
    private _triggerChanges;
}