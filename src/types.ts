import type {Readable} from 'stream'
import type { S3 } from 'aws-sdk'

import type { VFile} from 'vfile'

import type vinyl from 'vinyl'
export type { S3 } from 'aws-sdk'
export type { VFile } from 'vfile'
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

export type S3NodeBody = Buffer | string | Readable ;
export type FullS3Object = S3.Object & S3.GetObjectOutput
export type S3Item = FullS3Object & { Body: S3NodeBody }

export type Dict<T> = {[key:string]:T}
export type UsingFunc<T> = (s3Item: S3Item, i:number) => Promise<T>



export interface CrawfishCloudReturnNoProto{
    /**
     * ## Get the Async Iterator
     * @description where you can override the prior values of `body` and `filters` 
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param i.NextContinuationToken - Move to the next page of results for a given S3 prefix with the NextContinuationToken string from the S3 service
     * @param filters - Set of S3 URL glob filters
     * @todo Decide how to handle overlapping paths from varrying buckets
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})
        
        const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
        for await (const vf of crab.iter({body:true, using: asVfile}) ){
            console.log(vf)
        }    
     ```
     */
    iter<T>(inp:{body:boolean, using:UsingFunc<T>, NextContinuationToken?: string}, ...filters: string[]) : AsyncGenerator<T, void, undefined>
    
    /**
     * ## Get a Stream 
     * @description where you can override the prior values of `body` and `filters` 
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param filters - Set of S3 URL glob filters
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})
        
        const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
        crab.stream({body:true, using: asVfile})
            .pipe(rehypePipe())
            .pipe(destinationFolder())
     ```
     */
    stream<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Readable
    
    /**
     * ## Get a Promised Array the matched files from S3
     * @description where you can override the prior values of `body` and `filters` 
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param filters - Set of S3 URL glob filters
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})

        const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
        const arr = await crab.all({body:true, using: asVfile})
     ```
     */
    all<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Promise<T[]>
    
    /**
     * ## Reduce the files in the S3 Globs to a result.
     * 
     * @description Reduce the files represented in the glob into a new Type. 
      The process will batch sets of 1000 elements into memory and reduce them from there. 
      Larger memory trades for speed since you spend  less time spent setting up network connections and buffering network responses
     * @param init - starting value for reducer
     * @param using - mapper for transforming an S3Item into other types
     * @param reducer - folds the set of S3Items into a new Type
     * @param filters - S3 url globs
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})

        const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
        const count = await crab.reduce(0, using: asS3, reducer:(p)=>p+1)
     ```
     */
    reduce<T,U> (init:T, mapper:UsingFunc<U>, reducer:(prior:T, current:U, i:number)=>T, ...filters:string[]): Promise<T>
    
    /**
     * ## Vfile Stream 
     * @description within the `unifiedjs` ecosystem its useful to get a stream of vfiles - this method is setup for that use case.
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param filters - Set of S3 URL glob filters
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})
        
        const crab = crawler({s3c})
        crab.vfileStream('s3://ericdmoore.com-images/*.jpg')
            .pipe(jpgOptim())
            .pipe(destinationFolder())
     ```
     */
    vfileStream( ...filters: string[]) : Readable


    /**
     * ## Vinyl Stream 
     * @description within the gulp ecosystem its useful to get a stream of vinbyls - this method is setup for that use case.
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param filters - Set of S3 URL glob filters
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})
        
        const crab = crawler({s3c})
        crab.vinylStream('s3://ericdmoore.com-images/*.jpg')
            .pipe(jpgOptim())
            .pipe(destinationFolder())
     ```
     */
    vinylStream(...filters: string[]) : Readable


    /**
     * ## S3 Stream 
     * @description where you can override the prior values of `body` and `filters` 
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param filters - Set of S3 URL glob filters
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})
        
        const crab = crawler({s3c})
        crab.s3Stream('s3://ericdmoore.com-images/*.jpg')
            .pipe(S3ImageOptim())
            .pipe(destinationFolder())
     ```
     */
    s3Stream(...filters: string[]) : Readable


    /**
     * ## Async Iterator with [vfiles](https://github.com/vfile/vfile)
     * @description where you can override the prior values of `body` and `filters` 
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param i.NextContinuationToken - Move to the next page of results for a given S3 prefix with the NextContinuationToken string from the S3 service
     * @param filters - Set of S3 URL glob filters
     * @todo Decide how to handle overlapping paths from varrying buckets
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})
        
        const crab = crawler({s3c})
        for await (const vf of crab.vfileIter('s3://ericdmoore.com-images/*.jpg') ){
            console.log(vf)
        }    
     ```
     */
    vfileIter( ...filters: string[]): AsyncGenerator<VFile, void, undefined>
    
    /**
     * ## Async Iterator with [vinyls](https://github.com/gulpjs/vinyl)
     * @description where you can override the prior values of `body` and `filters` 
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param i.NextContinuationToken - Move to the next page of results for a given S3 prefix with the NextContinuationToken string from the S3 service
     * @param filters - Set of S3 URL glob filters
     * @todo Decide how to handle overlapping paths from varrying buckets
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})
        
        const crab = crawler({s3c})
        for await (const v of crab.vinylIter('s3://ericdmoore.com-images/*.jpg') ){
            console.log(vf)
        }    
     ```
     */
    vinylIter(...filters: string[]): AsyncGenerator<Vinyl, void, undefined>
    
    /**
     * ## Async Iterator with S3 Items - since the data starts out that way...
     * @description Asyn Generator of S3Items
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param i.NextContinuationToken - Move to the next page of results for a given S3 prefix with the NextContinuationToken string from the S3 service
     * @param filters - Set of S3 URL glob filters
     * @todo Decide how to handle overlapping paths from varrying buckets
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})
        
        const crab = crawler({s3c})
        for await (const s3i of crab.s3Iter('s3://ericdmoore.com-images/*.jpg') ){
            console.log(s3i)
        }
     ```
     */
    s3Iter(...filters: string[]): AsyncGenerator<S3Item,void, undefined>


     /**
     * ## Promised Vfile Array
     * @description load the whole glob set into memory and resolve
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param filters - Set of S3 URL glob filters
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})

        const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
        const vfArr = await crab.vfileArray()
     ```
     */
    vfileArray( ...filters: string[]): Promise<VFile[]>
    
    /**
     * ## Promised Vinyls Array
     * @description load the whole glob set into memory and resolve
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param filters - Set of S3 URL glob filters
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})

        const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
        const vArr = await crab.vinylArray()
     ```
     */
    vinylArray(...filters: string[]): Promise<Vinyl[]>
    
    /**
     * ## Promised S3Items Array
     * @description load the whole glob set into memory and resolve
     * @param i - input param
     * @param i.body - Option to include or ignore the file body? Adding it is more useful but slower
     * @param i.using - transform the S3Item to another data structure `using` this fn
     * @param filters - Set of S3 URL glob filters
     * @example
     ```ts
        import crawler, {asVfile} from 'crawfishcloud'
        import {S3, SharedIniFileCredentials} from 'aws-sdk'
        const credentials = new SharedIniFileCredentials({profile:'default'})
        const s3c = new S3({credentials, region:'us-west-2'})

        const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
        const arr = await crab.s3Array()
     ```
     */
    s3Array( ...filters: string[]): Promise<S3Item[]>
    
}
export interface CrawfishCloud{
    (input:{s3c: S3, body?: boolean, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturnNoProto
}

//  interface CrawfishCloudReturnWProto{
//     iter<T>(inp:{body:boolean, using:UsingFunc<T>, NextContinuationToken?: string}, ...filters: string[]) : AsyncGenerator<T, void, undefined>
//     stream<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Readable
//     all<T>(inp:{body:boolean, using:UsingFunc<T>}, ...filters: string[]) : Promise<T[]>
// }

//  interface CrawfishCloudwProto{
//     (input:{s3c: S3, body?: boolean, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturnWProto
//     head<T>(input:{s3c: S3, using: UsingFunc<T>, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturnWProto
//     body(input:{s3c: S3, body?: boolean, maxkeys?:number }, ...filters: string[]) : CrawfishCloudReturnWProto

//     vfileStream(input:{s3c: S3, maxkeys?:number }, ...filters: string[]) : Readable
//     vinylStream(input:{s3c: S3, maxkeys?:number }, ...filters: string[]) : Readable
//     vfileIter(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): AsyncGenerator<VFile, void, undefined>
//     vinylIter(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): AsyncGenerator<Vinyl, void, undefined>
//     vfileArray(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): Promise<VFile[]>
//     vinylArray(input:{s3c: S3, maxkeys?:number }, ...filters: string[]): Promise<Vinyl[]>
// }
// #enregion interfaces