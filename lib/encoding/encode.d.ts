/**
 * Copyright (c) 2018 Endel Dreyer
 * Copyright (c) 2014 Ion Drive Software Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE
 */
export declare function utf8Write(view: any, offset: any, str: any): void;
export declare function int8(bytes: any, value: any): void;
export declare function uint8(bytes: any, value: any): void;
export declare function int16(bytes: any, value: any): void;
export declare function uint16(bytes: any, value: any): void;
export declare function int32(bytes: any, value: any): void;
export declare function uint32(bytes: any, value: any): void;
export declare function int64(bytes: any, value: any): void;
export declare function uint64(bytes: any, value: any): void;
export declare function float32(bytes: any, value: any): void;
export declare function float64(bytes: any, value: any): void;
export declare function writeFloat32(bytes: any, value: any): void;
export declare function writeFloat64(bytes: any, value: any): void;
export declare function boolean(bytes: any, value: any): void;
export declare function string(bytes: any, value: any): number;
export declare function number(bytes: any, value: any): 1 | 2 | 3 | 5 | 9;
