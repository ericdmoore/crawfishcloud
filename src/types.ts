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

export interface CrawfishCloud{
    (input:{s3c: S3, body?: boolean, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturnNoProto
}

export interface CrawfishCloudReturnNoProto{
    iter<T>(inp:{body:boolean, using:UsingFunc<T>, NextContinuationToken?: string}, ...filters: string[]) : AsyncGenerator<T, void, undefined>
    stream<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Readable
    all<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Promise<T[]>

    vfileStream( ...filters: string[]) : Readable
    vinylStream(...filters: string[]) : Readable
    s3Stream(...filters: string[]) : Readable

    vfileIter( ...filters: string[]): AsyncGenerator<VFile, void, undefined>
    vinylIter(...filters: string[]): AsyncGenerator<Vinyl, void, undefined>
    s3Iter(...filters: string[]): AsyncGenerator<S3Item,void, undefined>

    vfileArray( ...filters: string[]): Promise<VFile[]>
    vinylArray(...filters: string[]): Promise<Vinyl[]>
    s3Array( ...filters: string[]): Promise<S3Item[]>
    
}


export interface CrawfishCloudwProto{
    (input:{s3c: S3, body?: boolean, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturnWProto
    head<T>(input:{s3c: S3, using: UsingFunc<T>, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturnWProto
    body(input:{s3c: S3, body?: boolean, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturnWProto

    vfileStream(input:{s3c: S3, maxkeys?:number }, ...filters: string[]) : Readable
    vinylStream(input:{s3c: S3, maxkeys?:number }, ...filters: string[]) : Readable
    vfileIter(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): AsyncGenerator<VFile, void, undefined>
    vinylIter(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): AsyncGenerator<Vinyl, void, undefined>
    vfileArray(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): Promise<VFile[]>
    vinylArray(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): Promise<Vinyl[]>
}
export interface CrawfishCloudReturnWProto{
    iter<T>(inp:{body:boolean, using:UsingFunc<T>, NextContinuationToken?: string}, ...filters: string[]) : AsyncGenerator<T, void, undefined>
    stream<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Readable
    all<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Promise<T[]>
}


export type S3NodeBody = Buffer | string | Readable ;
export type FullS3Object = S3.Object & S3.GetObjectOutput
export type S3Item = FullS3Object & { Body: S3NodeBody }



// #enregion interfaces