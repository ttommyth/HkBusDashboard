import { RouteStopData } from "./RouteStopData";

export interface GenericResponse<T>{
    type: string;
    version: string;
    generated_timestamp: Date;
    data:T;
}