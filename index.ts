import type {S3} from 'aws-sdk'
import stream, {Readable, Transform} from 'stream'
import vfile from 'vfile'
import vinyl from 'vinyl'
import {URL} from 'url'




export const s3urlToConfig = (s3url:string)=>{
    return {}
}

export const s3ConfigToUrl = (s3cfg: S3Config )=>{
    const {Bucket, Key, ...others} = s3cfg
    let s3url = `s3://${Bucket}/${Key}`
    let s3urlq = Object.entries(others).reduce((p,[key, val])=>{
        return ''
    },'' as string)

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