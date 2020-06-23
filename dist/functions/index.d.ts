export declare const numberFormat: (value: any, lang: string, fraction?: number | undefined) => string;
export declare const moneyFormat: (value: any, lang: string, fraction?: number | undefined, _currency?: string | undefined) => string;
export declare const formattedDate: (_date: any, lang: string, withTime?: boolean | undefined, short?: boolean | undefined, withoutYear?: boolean | undefined) => string | undefined;
export declare const shortNumberFormat: (param: any, language: string, precision?: number | undefined) => any;
export declare const clamp: (val: number, min: number, max: number) => number;
export declare const randomChar: () => string;
export declare const isBlank: (str: string) => boolean;
