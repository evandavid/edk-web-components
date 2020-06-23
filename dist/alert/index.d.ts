import { IAlertShow } from './platform/web';
interface IAlert {
    show: (params: IAlertShow) => void;
}
export declare const EDKAlert: IAlert;
export {};
