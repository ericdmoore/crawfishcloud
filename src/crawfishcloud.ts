import { Readable } from 'stream'
import { isMatch } from 'micromatch'
//
import type * as k from './types'
import { asVfile, asVinyl, asS3} from './exporters'
import { s3urlToConfigWfilters, s3ConfigToUrl , loadObjectList} from './utils'

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
     * @param inp 
     * @param filters 
     */
    const iter = async function * <T>(inp: {body:boolean, using: k.UsingFunc<T>, NextContinuationToken?:string,}, ...filters:string[]) : AsyncGenerator<T, void, undefined>{
        const bucketPrefixes = filters.length > 0 ? filters.map(s3urlToConfigWfilters) : config.BucketsPrefixes

        // uses for loop to not add function scope to the asyncGenerator
        // start at back and run down
        // console.log({bucketPrefixes})

        for( let j = bucketPrefixes.length-1; j >= 0; j-- ){
            const {Bucket, Key, prefix, suffix} = bucketPrefixes[j]
            // console.log({Bucket, Key, prefix, suffix})
            
            const objListResp = await s3c.listObjectsV2({Bucket, MaxKeys, Prefix: prefix, ContinuationToken: inp.NextContinuationToken}).promise()
            // console.log({objListResp})
            
            const keyList = objListResp.Contents ?? []
            const keyListFiltered = await Promise.all(keyList.filter(e => isMatch(e.Key ?? '', `${prefix}${suffix}`, {bash:true })))

            if(!inp.body){
                const mappedList = await Promise.all(
                    keyListFiltered.map( (v,k) => inp.using( { ...v, Body:'' },k) as unknown as Promise<T> )
                )
                yield* mappedList

                if(objListResp.NextContinuationToken){
                    yield* iter({
                            body: inp.body, 
                            using: inp.using, 
                            NextContinuationToken: objListResp.NextContinuationToken
                        },
                        s3ConfigToUrl({Bucket, Key}))
                }
            }else{
                const namedObjList = await loadObjectList(s3c, Bucket, ...keyListFiltered)
                const r = await Promise.all(namedObjList.map((v,k) => inp.using({...v, Body: v.Body as k.S3NodeBody}, k) as unknown as Promise<T>))
                yield* r
                
                if(objListResp.NextContinuationToken){
                    yield* iter({
                            body: inp.body, 
                            using: inp.using, 
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
     * @param i 
     * @param filters 
     */
     const stream = <T>(i:{body:boolean, using: k.UsingFunc<T>}, ...filters:string[])=>{
        return Readable.from(iter(i, ...filters))
    }

    /**
     * Resolveable Promise with an Array of All matches 
     * @description where you can override the prior values of `body` and `filters` 
     * @param i 
     * @param filters 
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
     * @param mapper - maps S3Item input type to other types
     * @param reducer - folds the set of S3Items and folds them d
     * @param filters - S3 url globs
     */
    const reduce = async <OutType,ElemType>(
            init:OutType, 
            mapper:k.UsingFunc<ElemType>, 
            reducer:(prior:OutType, current:ElemType, i:number)=>OutType, 
            ...filters:string[]) => {

        let j = 0
        for await(const elem of iter({body:true, using: mapper },...filters)){
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
