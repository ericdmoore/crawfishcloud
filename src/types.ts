import type {Readable} from 'stream'
import type { S3 } from 'aws-sdk'
export type { S3 } from 'aws-sdk'

import type {VFile} from 'vfile'
export type { VFile } from 'vfile'

import type vinyl from 'vinyl'
export type Vinyl = vinyl


export interface S3Config {
    Bucket: string
    Key: string
    [others:string]:string
}

export interface S3BucketPrefix {
    Bucket: string
    Key: string
    prefix:string
    suffix:string
    [others:string]:string
}

export type Dict<T> = {[key:string]:T}
export type UsingFunc<T> = (s3Item: S3Item, i:number) => Promise<T>

export interface CrawfishCloudReturn{
    iter<T>(inp:{body:boolean, using:UsingFunc<T>, NextContinuationToken?: string}, ...filters: string[]) : AsyncGenerator<T, void, undefined>
    stream<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Readable
    all<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Promise<T[]>
}

export interface CrawfishCloud{
    (input:{s3c: S3, body?: boolean, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturn
    head<T>(input:{s3c: S3, using: UsingFunc<T>, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturn
    body(input:{s3c: S3, body?: boolean, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturn

    vfileStream(input:{s3c: S3, maxkeys?:number }, ...filters: string[]) : Readable
    vinylStream(input:{s3c: S3, maxkeys?:number }, ...filters: string[]) : Readable
    vfileIter(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): AsyncGenerator<VFile, void, undefined>
    vinylIter(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): AsyncGenerator<Vinyl, void, undefined>
    vfileArray(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): Promise<VFile[]>
    vinylArray(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): Promise<Vinyl[]>
}


export type S3NodeBody = Buffer | string | Readable ;
export type FullS3Object = S3.Object & S3.GetObjectOutput
export type S3Item = FullS3Object & { Body: S3NodeBody }



// #enregion interfaces