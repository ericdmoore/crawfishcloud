import { Readable } from 'stream'
import { isMatch } from 'micromatch'
//
import type * as k from './types'
import { asVfile, asVinyl, asS3} from './exporters'
import { s3urlToConfigWfilters, s3ConfigToUrl , loadObjectList} from './utils'


/**
 * The crawler takes a base config of your S3Client object, and some base configs, that setup your defaults for the crawler.  
 *
 * @param input 
 * @param input.s3c - a configured S3 Client that is authorized to make calls
 * @param filters - default set of S3 Url globs
 * @todo - code to help lack of acccess to S3
 * @example
  ```ts
    import crawler from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    const ret = await crab.vfileArray()
  ```
 */
export const crawler = function (input:{s3c: k.S3, body?: boolean, maxkeys?:number }, ...filters: string[]):k.CrawfishCloudReturnNoProto {
    const config = {
        filters,
        body: true, 
        MaxKeys: input.maxkeys ?? 1000,
        BucketsPrefixes: filters.map(s3urlToConfigWfilters),
        ...input,
    }

    const {s3c} = input
    const {MaxKeys} = config

    /**
     * Get the Async Iterator
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
    const iter = async function * <T>(i: {body:boolean, using: k.UsingFunc<T>, NextContinuationToken?:string,}, ...filters:string[]) : AsyncGenerator<T, void, undefined>{
        const bucketPrefixes = filters.length > 0 ? filters.map(s3urlToConfigWfilters) : config.BucketsPrefixes

        // uses for loop to not add function scope to the asyncGenerator
        // start at back and run down
        // console.log({bucketPrefixes})

        for( let j = bucketPrefixes.length-1; j >= 0; j-- ){
            const {Bucket, Key, prefix, suffix} = bucketPrefixes[j]
            // console.log({Bucket, Key, prefix, suffix})
            
            const objListResp = await s3c.listObjectsV2({Bucket, MaxKeys, Prefix: prefix, ContinuationToken: i.NextContinuationToken}).promise()
            // console.log({objListResp})
            
            const keyList = objListResp.Contents ?? []
            const keyListFiltered = await Promise.all(keyList.filter(e => isMatch(e.Key ?? '', `${prefix}${suffix}`, {bash:true })))

            if(!i.body){
                const mappedList = await Promise.all(
                    keyListFiltered.map( (v,k) => i.using( { ...v, Bucket, Body:'' },k) as unknown as Promise<T> )
                )
                yield* mappedList

                if(objListResp.NextContinuationToken){
                    yield* iter({
                            body: i.body, 
                            using: i.using, 
                            NextContinuationToken: objListResp.NextContinuationToken
                        },
                        s3ConfigToUrl({Bucket, Key}))
                }
            }else{
                const namedObjList = await loadObjectList(s3c, Bucket, ...keyListFiltered)
                const r = await Promise.all(namedObjList.map((v,k) => i.using({...v, Bucket, Body: v.Body as k.S3NodeBody}, k) as unknown as Promise<T>))
                yield* r
                
                if(objListResp.NextContinuationToken){
                    yield* iter({
                            body: i.body, 
                            using: i.using, 
                            NextContinuationToken: objListResp.NextContinuationToken
                        },
                        s3ConfigToUrl({Bucket, Key}))
                }
            }
        }
    }

    /**
     * Stream 
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
     const stream = <T>(i:{body:boolean, using: k.UsingFunc<T>}, ...filters:string[])=>{
        return Readable.from(
            iter(i, ...filters), 
            {objectMode: true}
        )
    }

    /**
     * Resolveable Promise with an Array of All matches 
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
    const all = async <T>(i:{body:boolean, using: k.UsingFunc<T>}, ...filters:string[]): Promise<T[]>=>{
        const acc = [] as T[]
        for await (const f of iter(i, ...filters)){
            acc.push(f)
        }
        return acc
    }
    
    /**
     * 
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
    const reduce = async <OutType,ElemType>(
            init:OutType, 
            using:k.UsingFunc<ElemType>, 
            reducer:(prior:OutType, current:ElemType, i:number)=>OutType,
            ...filters:string[]) => {

        let j = 0
        for await(const elem of iter({body:true, using },...filters)){
            init = reducer(init, elem, j)
            j++
        }
        return init
    }


    return { 
        iter, 
        all, 
        stream,
        reduce,

        vfileStream: ( ...filters: string[]) => crawler(input).stream({body:true, using: asVfile}, ...filters),
        vinylStream: ( ...filters: string[]) => crawler(input).stream({body: true, using: asVinyl}, ...filters),
        s3Stream: (...filters: string[]) => crawler({...input}).stream({body:true, using: asS3}, ...filters),
        
        vfileIter: ( ...filters: string[]) => crawler(input).iter({body: true, using: asVfile}, ...filters),
        vinylIter: ( ...filters: string[]) => crawler(input).iter({body: true, using: asVinyl}, ...filters),
        s3Iter:(...filters: string[])=>crawler({...input}).iter({body:true, using: asS3}, ...filters),
        
        vfileArray: (...filters: string[]) => crawler(input).all({body:true, using: asVfile}, ...filters),
        vinylArray: ( ...filters: string[]) => crawler(input).all({body:true, using: asVinyl}, ...filters),
        s3Array:(...filters: string[])=>crawler({...input}).all({body:true, using: asS3}, ...filters),
    }
}

// crawler.prototype.body = <T>(input:{s3c: k.S3, using :k.UsingFunc<T>, maxkeys?:number }, ...filters: string[]) => crawler({...input, body:true},...filters)
// crawler.prototype.head = <T>(input:{s3c: k.S3, using :k.UsingFunc<T>, maxkeys?:number }, ...filters: string[]) => crawler({...input, body:false},...filters)
//
// crawler.prototype.vfileStream = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input}).stream({body:true, using: asVfile}, ...filters)
// crawler.prototype.vinylStream = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input}).stream({body: true, using: asVinyl}, ...filters)
//
// crawler.prototype.vfileIter = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input }).iter({body: true, using: asVfile}, ...filters)
// crawler.prototype.vinylIter = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input }).iter({body: true, using: asVinyl}, ...filters)
//
// crawler.prototype.vfileArray = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input }).all({body:true, using: asVfile}, ...filters)
// crawler.prototype.vinylArray = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input }).all({body:true, using: asVinyl}, ...filters)

export default crawler as unknown as k.CrawfishCloud
