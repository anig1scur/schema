import { Ref } from "./ChangeTree";
export declare class ReferenceTracker {
    refs: Map<number, Ref>;
    refCounts: {
        [refId: number]: number;
    };
    deletedRefs: Set<number>;
    protected nextUniqueId: number;
    getNextUniqueId(): number;
    addRef(refId: number, ref: Ref, incrementCount?: boolean): void;
    removeRef(refId: number): void;
    clearRefs(): void;
    garbageCollectDeletedRefs(): void;
}