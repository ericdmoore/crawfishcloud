/* globals test, expect */

import * as k from '../../src/types'
//
import crawler from "../../src/index"

import {S3, SharedIniFileCredentials} from 'aws-sdk'
const credentials = new SharedIniFileCredentials({profile:'personal_default'})
const s3c = new S3({credentials, region:'us-west-2'})

const TIMEOUT = 30 * 1000

test('Find JPGs from the network', async ()=>{
    const ret = await crawler({s3c})
        .vfileArray('s3://ericdmoore.com-images/*.jpg')
        .catch(er=> {console.error('test1:',er); return [] as k.VFile[] })
        
    expect(ret.every((vf) => vf.path?.endsWith('.jpg'))).toBe(true)
},TIMEOUT)


test('Find PNGs from the network', async ()=>{
    const ret = await crawler({s3c})
        .s3Array('s3://ericdmoore.com-images/*.png')
        .catch(er=> {console.error('test2:',er); return [] as k.S3Item[] })

    expect(ret.every((s3o) => s3o.Key?.endsWith('.png'))).toBe(true)
},TIMEOUT)

test('Find SVGs from the network', async () =>{
    const ret = await crawler({s3c})
        .vinylArray('s3://ericdmoore.com-images/*.svg')
        .catch(er=> {console.error('allSVGs:',er); return [] as k.Vinyl[] })

    expect(ret.every((v) => v.path.endsWith('.svg'))).toBe(true)       
},TIMEOUT)