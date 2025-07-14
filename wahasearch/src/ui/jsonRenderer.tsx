import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";

type JsonRendererProps = { data: any };

const valueStyle: React.CSSProperties = {
    color: '#4ec9b0',
    marginLeft: 4,
    fontFamily: 'monospace',
};
const keyStyle: React.CSSProperties = {
    color: '#dcdcaa',
    fontWeight: 600,
    fontFamily: 'monospace',
};
const typeStyle: React.CSSProperties = {
    color: '#b5cea8',
    fontStyle: 'italic',
    fontSize: '0.9em',
    marginLeft: 6,
};
const copyBtnStyle: React.CSSProperties = {
    marginLeft: 6,
    fontSize: '0.8em',
    cursor: 'pointer',
    background: 'none',
    border: '1px solid #666',
    borderRadius: 3,
    color: '#aaa',
};

function isPrimitive(val: any) {
    return val === null || typeof val !== 'object';
}

function displayType(val: any) {
    if (val === null) return 'null';
    if (Array.isArray(val)) return `Array[${val.length}]`;
    if (val instanceof Map) return `Map[${val.size}]`;
    if (typeof val === 'object') return `Object{${Object.keys(val).length}}`;
    return typeof val;
}

function CopyButton({ value }: { value: any }) {
    return (
        <button
            style={copyBtnStyle}
            title="Copy value"
            onClick={() => navigator.clipboard.writeText(JSON.stringify(value, null, 2))}
        >
            📋
        </button>
    );
}
const levelStyle: React.CSSProperties = {
    marginLeft: 2,
    borderLeft: '1px solid #666',
    paddingLeft: 10
};
const JsonRenderer: React.FC<JsonRendererProps> = ({ data }) => {
    if (isPrimitive(data)) {
        return (
            <span style={valueStyle}>
                {typeof data === 'string' ? `"${data}"` : String(data)}
                <span style={typeStyle}>({displayType(data)})</span>
                <CopyButton value={data} />
            </span>
        );
    }
    if (data instanceof Map) {
        const entries = Array.from(data.entries());
        if (entries.length === 0) return <span style={valueStyle}>{'{}'} <span style={typeStyle}>(empty map)</span></span>;
        return (
            <div style={levelStyle}>
                {entries.map(([key, value], idx) => {
                    let label = String(key);
                    if (value && typeof value === 'object') {
                        let extra = '';
                        if ('name' in value && typeof value.name === 'string') {
                            extra = " : " + value.name;
                        } else if ('@_name' in value && typeof value['@_name'] === 'string') {
                            extra = " : " + value['@_name'];
                        } else if ('type' in value && typeof value.type === 'string') {
                            extra = " : " + value.type;
                        } else if ('@_type' in value && typeof value['@_type'] === 'string') {
                            extra = " : " + value['@_type'];
                        }
                        if (extra) label = `${key}${extra}`;
                    }
                    return isPrimitive(value) ? (
                        <div key={String(key)} style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={keyStyle}>{label}:</span>
                            <span style={valueStyle}>
                                {typeof value === 'string' ? `"${value}"` : String(value)}
                                <span style={typeStyle}>({displayType(value)})</span>
                                <CopyButton value={value} />
                            </span>
                        </div>
                    ) : (
                        <Collapsible key={String(key)} defaultOpen={entries.length <= 3 && !String(key).startsWith("_")}>
                            <CollapsibleTrigger>
                                <span style={keyStyle}>{label}</span>
                                <span style={typeStyle}>
                                    {displayType(value)}
                                </span>
                            </CollapsibleTrigger>
                            <CopyButton value={value} />
                            <CollapsibleContent>
                                <JsonRenderer data={value} />
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </div>
        );
    }
    if (Array.isArray(data)) {
        if (data.length === 0) return <span style={valueStyle}>[] <span style={typeStyle}>(empty array)</span></span>;
        return (
            <div style={levelStyle}>
                {data.map((item, idx) => {
                    let label = `[${idx}]`;
                    if (item && typeof item === 'string') {
                        label = `[${idx}]: ${item}`;
                    }
                    if (item && typeof item === 'object') {
                        let extra = '';
                        if ('name' in item && typeof item.name === 'string') {
                            extra = item.name;
                        } else if ('@_name' in item && typeof item['@_name'] === 'string') {
                            extra = item['@_name'];
                        } else if ('type' in item && typeof item.type === 'string') {
                            extra = item.type;
                        } else if ('@_type' in item && typeof item['@_type'] === 'string') {
                            extra = item['@_type'];
                        }
                        if (extra) label = `[${idx}] ${extra}`;
                    }
                    return (
                        <Collapsible key={idx} defaultOpen={data.length <= 3 && !String(idx).startsWith("_")}>
                            <CollapsibleTrigger>
                                <span style={keyStyle}>{label}</span>
                                <span style={typeStyle}> {displayType(item)}</span>
                            </CollapsibleTrigger>
                            <CopyButton value={(item)} />
                            <CollapsibleContent>
                                <JsonRenderer data={item} />
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </div>
        );
    }
    if (typeof data === 'object' && data !== null) {
        const entries = Object.entries(data);
        if (entries.length === 0) return <span style={valueStyle}>{'{}'} <span style={typeStyle}>(empty object)</span></span>;
        return (
            <div style={levelStyle}>
                {entries.map(([key, value], idx) => (
                    isPrimitive(value) ? (
                        <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={keyStyle}>{key}:</span>
                            <span style={valueStyle}>
                                {typeof value === 'string' ? `"${value}"` : String(value)}
                                <span style={typeStyle}>({displayType(value)})</span>
                                <CopyButton value={value} />
                            </span>
                        </div>
                    ) : (
                        <Collapsible key={key} defaultOpen={entries.length <= 3 && !String(key).startsWith("_")}>
                            <CollapsibleTrigger>
                                <span style={keyStyle}>{key}</span>
                                <span style={typeStyle}>
                                    {displayType(value)}
                                </span>
                            </CollapsibleTrigger>
                            <CopyButton value={(value)} />
                            <CollapsibleContent>
                                <JsonRenderer data={value} />
                            </CollapsibleContent>
                        </Collapsible>
                    )
                ))}
            </div>
        );
    }
    return <span style={valueStyle}>{String(data)}</span>;
};

export default JsonRenderer;

