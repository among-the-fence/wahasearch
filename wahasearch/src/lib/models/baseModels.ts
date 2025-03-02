
export interface identifier {
    id: string;
    _raw: any;
}

export interface Base extends identifier {
    typeId: string;
    typeName: string;
    type: string;
}

export interface Named extends identifier {
    name: string;
}

export function mapBase(data: any): Base {
    return {
        ...mapIdentifier(data),
        typeId: data["@_typeId"],
        typeName: data["@_typeName"],
        type: data["@_type"],
    };
}

export function mapName(data: any): Named {
    return {
        ...mapIdentifier(data),
        name: data["@_name"],
    };
}

export function mapIdentifier(data: any): identifier {
    return {
        _raw: data,
        id: data["@_id"],
    };
}