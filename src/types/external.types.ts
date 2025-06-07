import { v4 as uuid } from "uuid";

export type UUID = string & { __brand: "uuid" } ;

export function UUIDv4(): UUID {
    return uuid() as UUID;
}