/* Credits to: https://hackernoon.com/mastering-type-safe-json-serialization-in-typescript for the JSONValue type */
type JSONPrimitive = string | number | boolean | null | undefined;

type JSONValue = JSONPrimitive | JSONValue[] | {
    [key: string]: JSONValue;
};
