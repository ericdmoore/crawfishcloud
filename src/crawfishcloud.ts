import { Readable } from 'stream'
import micromatch from 'micromatch'
//
import type * as k from './types'
import { asVfile, asVinyl } from './exporters'
import { s3urlToConfigWfilters, s3ConfigToUrl , loadObjectList} from './utils'

export const crawler = (input:{s3c: k.S3, body?: boolean, maxkeys?:number }, ...filters: string[]):k.CrawfishCloudReturn =>{
    const config = {
        body:false, 
        filters,
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
        for( let j = bucketPrefixes.length-1; j >= 0; j-- ){
            const {Bucket, Key, prefix, suffix} = bucketPrefixes[j]
            
            const objListResp = await s3c.listObjectsV2({Bucket, MaxKeys, Prefix: prefix, ContinuationToken: inp.NextContinuationToken}).promise()
                .catch(er => {
                    console.error(er)
                    return Promise.resolve([]) as Promise<k.S3.ListObjectsV2Output>
                })
            
            const keyList = objListResp.Contents ?? []
            const keyListFiltered = await Promise.all(
                keyList
                .filter(e => micromatch.isMatch(e.Key ?? '', `${prefix}${suffix}`, {bash:true}))
            )

            if(!inp.body){
                const list = await Promise.all(
                    keyListFiltered.map( (v,k) => inp.using( { ...v, Body:'' },k) as unknown as Promise<T> )
                )
                yield* list

                if(objListResp.NextContinuationToken){
                    yield* iter({
                            body: inp.body, 
                            using:inp.using, 
                            NextContinuationToken:objListResp.NextContinuationToken
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
        return new Promise((resolve, reject)=>{
            stream(i, ...filters)
            .on('data', (chunk) => acc.push(chunk) )
            .on('close', () => resolve(acc as T[]))
            .on('error', (er) => reject(er))
        })
    }
    
    return { iter, all, stream }
}

crawler.prototype.body = <T>(input:{s3c: k.S3, using :k.UsingFunc<T>, maxkeys?:number }, ...filters: string[]) => crawler({...input, body:true},...filters)
crawler.prototype.head = <T>(input:{s3c: k.S3, using :k.UsingFunc<T>, maxkeys?:number }, ...filters: string[]) => crawler({...input, body:false},...filters)

crawler.prototype.vfileStream = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input}).stream({body:true, using: asVfile}, ...filters)
crawler.prototype.vinylStream = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input}).stream({body: true, using: asVinyl}, ...filters)

crawler.prototype.vfileIter = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input }).iter({body: true, using: asVfile}, ...filters)
crawler.prototype.vinylIter = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input }).iter({body: true, using: asVinyl}, ...filters)

crawler.prototype.vfileArray = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input }).all({body:true, using: asVfile}, ...filters)
crawler.prototype.vinylArray = (input:{s3c: k.S3, maxkeys?:number }, ...filters: string[]) => crawler({...input }).all({body:true, using: asVinyl}, ...filters)

export default crawler as unknown as k.CrawfishCloud
