import type * as k from './types';
import { URL } from 'url';

export const s3ConfigToUrl = (s3cfg: k.S3Config) => {
    const { Bucket, Key, ...others } = s3cfg;
    const s3urlQ = Object.entries(others).map(([key, val]) => {
        return `${encodeURI(key)}=${encodeURI(val)}`;
    }).join('&');
    return `s3://${Bucket}/${Key}${s3urlQ.length > 0 ? `?${s3urlQ}` : ''}`;
};

export const s3urlToConfig = (s3url: string) => {
    const s3Cfg = new URL(s3url);
    const qs: k.Dict<string> = [...s3Cfg.searchParams.entries()]
        .reduce(
            (acc, [key, val]: [string, string]) => ({ ...acc, [key]: val }),
            {} as k.Dict<string>
        );
    return {
        Bucket: s3Cfg.hostname,
        Key: s3Cfg.pathname.slice(1),
        ...qs
    };
};

export const loadObjectList = (s3c: k.S3, Bucket:string, ...keyList: k.S3.Object[]) => Promise.all(
    keyList.map( async o => ({
            ...( await s3c.getObject({ 
                    Bucket, 
                    Key: typeof o === 'string' 
                        ? o 
                        : o.Key ?? '' }).promise()
                ),
            ...o,
    })
))

export const s3urlToConfigWfilters = (filter:string, i:number, a:string[]): k.S3BucketPrefix => {
    const s3Cfg = s3urlToConfig(filter)
    const prefix = s3Cfg.Key.includes('*') ? s3Cfg.Key.split('*')[0] : s3Cfg.Key
    const suffix = s3Cfg.Key.includes('*') ? s3Cfg.Key.slice(prefix.length) : ''
    return { ...s3Cfg, prefix, suffix };
};
