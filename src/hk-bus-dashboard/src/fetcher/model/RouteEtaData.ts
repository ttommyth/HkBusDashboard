export interface RouteEtaData {
    co: string;
    route: string;
    dir: string;
    service_type: number;
    seq: number;
    dest_tc: string;
    dest_sc: string;
    dest_en: string;
    eta_seq: number;
    eta: Date;
    rmk_tc: string;
    rmk_sc: string;
    rmk_en: string;
    data_timestamp: Date;
}