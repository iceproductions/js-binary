
declare module "js-binary" {
    export class Data {
        private _buffer: Buffer;
        private _length: number;
        constructor(capacity: number);

        appendBuffer(data: Buffer): void;
        writeUInt8(value: number): void;
        writeUInt16(value: number): void;
        writeUInt32(value: number): void;
        writeDouble(value: number): void;
        toBuffer(): Buffer;
        private _alloc(bytes: number): void;
    }

    export class ReadState {
        constructor(buffer: Buffer);
        private _buffer: Buffer;
        private _offset: number;

        peekUInt8(): number;
        readUInt8(): number;
        readUInt16(): number;
        readUInt32(): number;
        readDouble(): number;
        readBuffer(): Buffer;
        hasEnded(): boolean;
    }

    export interface DataType<Type> {
        write(type: Type, data: Data, path: string): void;
        read(state: ReadState): Type;
    }

    export interface types {
        uint: DataType<number>;
        int: DataType<number>;
        float: DataType<number>;
        string: DataType<string>;
        Buffer: DataType<Buffer>;
        boolean: DataType<boolean>;
        json: DataType<any>;
        oid: DataType<string>;
        regex: DataType<RegExp>;
        date: DataType<Date>;
    }

    interface ITypeDeclaration {
        [key: string]: TypeDeclaration;
    }

    type TypeDeclaration = keyof types | [keyof types] | "{object}" | "[array]" | ITypeDeclaration | [ITypeDeclaration];

    enum TYPE {
        UINT = 'uint',
        INT = 'int',
        FLOAT = 'float',
        STRING = 'string',
        BUFFER = 'Buffer',
        BOOLEAN = 'boolean',
        JSON = 'json',
        OID = 'oid',
        REGEX = 'regex',
        DATE = 'date',
        ARRAY = '[array]',
        OBJECT = '{object}'
    }

    export class Type {
        type: TYPE;
        fields?: Field[];
        subType?: Type;

        constructor(type: TypeDeclaration);

        encode(value: any): Buffer;
        decode(data: Buffer): any;

        write(value: any, data: Data, path: string): void;
        private _writeArray(value: any, data: Data, path: string, type: Type): void;
        
        read(state: ReadState): void;
        private _compileRead(): (state: ReadState) => void;
        private _readArray(type: Type, state: ReadState): number[];
        getHash(): Buffer;
    }

    export class Field {
        optional: boolean;
        name: string;
        array: boolean;
        type: Type;
        
        constructor(name: string, type: TypeDeclaration);
    }
}