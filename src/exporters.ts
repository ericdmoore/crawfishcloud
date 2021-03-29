import type * as k from './types'
//
import { Readable } from 'stream'
import vfile from 'vfile'
import Vinyl from 'vinyl'

const drainReadable = (init:string , r: Readable, tail:string):Promise<string>=>{
    let acc: string[]  = [init]
    return new Promise((resolve, reject)=>{
        r.on('data',(chunk) => {acc.push(chunk.toString())})
        .on('close',() => resolve(`${acc.join('')}${tail}` as string))
        .on('error',(er) => reject(er))
       return ''
    })
}

export const awsS3 = async (o: k.S3Item, i:number):Promise<k.S3Item> => o 

export const asVfile = async (o:k.S3Item, i:number ): Promise<vfile.VFile> =>{
    
    const Body = o.Body as k.S3NodeBody
    if( Buffer.isBuffer(Body) || typeof Body === 'string' ){
        return vfile({path: o.Key, contents: Body })
    } else {
        return vfile({ path: o.Key, contents: await drainReadable('', Body,'') })
    }
}

export const asVinyl = async (o:k.S3Item, i:number): Promise<Vinyl> => {
    const Body = o.Body as k.S3NodeBody
    if( Buffer.isBuffer(Body) || typeof Body === 'string' ){
        return new Vinyl ({path: o.Key, contents: Buffer.from(Body) })
    } else {
        return new Vinyl ({path: o.Key, contents: Buffer.from(await drainReadable('', Body,'')) })
    }
}