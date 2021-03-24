import type {S3} from 'aws-sdk'
import stream, {Readable, Transform} from 'stream'
import {URL} from 'url'
import vfile from 'vfile'
import vinyl from 'vinyl'

export const s3urlToConfig = (s3url:string)=>{
    const s3Cfg = new URL(s3url)
    const qs: {[param:string]:string} = {... s3Cfg.searchParams }
    return {Bucket:s3Cfg.hostname, Key: s3Cfg.pathname, ...qs}
}

export const s3ConfigToUrl = (s3cfg: S3Config )=>{
    const {Bucket, Key, ...others} = s3cfg
    const s3urlQ = Object.entries(others).map(([key, val])=>{
        return `${encodeURI(key)}=${encodeURI(val)}`
    }).join('&')
    return `s3://${Bucket}/${Key}${ s3urlQ.length > 0 ? `?${s3urlQ}` : ''}`
}
export const crawler = ()=>{
    const iter = ()=>{}
    const all = ()=>{}
    const stream = ()=>{}
}

export default crawler

// #region interfaces
export interface S3Config {
    Bucket: string
    Key: string
    [others:string]:string
}

export type FileOutputType = 'vfile' | 'vinyl' | (<T>(s3Item: (S3.Object & S3.Body)) => T)
export interface crawfishCloud{
    stream(as?: FileOutputType): Readable
    iter<T>(as?: FileOutputType): AsyncIterator<T,T,T>
    all<T>(as?: FileOutputType): Promise<Array<T>>
}

// #enregion interfaces