export declare const SWITCH_TO_STRUCTURE = 255;
export declare const TYPE_ID = 213;
/**
 * Encoding Schema field operations.
 */
export declare enum OPERATION {
    ADD = 128,
    REPLACE = 0,
    DELETE = 64,
    DELETE_AND_ADD = 192,// 11100000
    TOUCH = 1,// 00000000
    CLEAR = 10
}
