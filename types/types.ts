import { Request } from "express"
import { Company } from "../model/Company"
import { User } from '../model/User'
import { FieldsExtends} from '../routes/types'


export type Day = {
    beginHours: string;
    endHours: string;
}
export type OpeningDay = {
    monday : Day
    tuesday : Day
    wednesday : Day
    thursday : Day
    friday : Day
    saturday : Day
    sunday : Day
}

export type Photo = {
    path: string;
}

export interface IGetUserAuthInfoRequest extends Request {
    Fields: FieldsExtends
    user: User | Company // or any other type
}