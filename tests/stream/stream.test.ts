import crawler from "../../src/index"
import s3c from '../aws'

import * as k from '../../src/types'
import {Writable} from 'stream'


const TIMEOUT = 40 * 1000

const dest = ( name:string, printCond: ()=>boolean = ()=>false, verbose = false,  ) => { 
    const list = [] as unknown[]
    const getCount = () => list.length
    const setPrintCond = (input:()=>boolean = ()=>false) => {printCond = input}
    const getEntries = () => Object.freeze(list)
    return {
        getCount,
        getEntries,
        setPrintCond,
        writeStream:  new Writable({
            objectMode:true,
            write: function(chunk, enc, cb){ 
                list.push(chunk)
                if( printCond() ) console.log(name, {count: getCount(), chunk})
                cb()
            },
            final: function(cb){
                if(verbose) console.log(name, {count: getCount()})
                cb()
            }
        })
    }
}


/**
 * check values with 
 * @bash aws s3 ls 's3://ericdmoore.com-images/a' --profile='personal_default' | grep 'a*.jpg' | wc -l
 */
test('Find a*.jpg from the network', async () => {
    const d = dest('A star JPGs', ()=>false, false)
    // d.setPrintCond( () => d.getCount() %5 ===0 )
    
    await new Promise((resolve, reject)=>{
        crawler({s3c}).vfileStream('s3://ericdmoore.com-images/a*.jpg')
            .pipe(d.writeStream)
            .on('finish', resolve)
            .on('error', reject)
    })
    
    expect(d.getCount()).toBe(26)
    expect(d.getEntries().every(vf => (vf as k.VFile).path?.endsWith('.jpg'))).toBe(true)
},TIMEOUT)


test('Find *.png from the network', async () => {
    const d = dest('Star PNGs', ()=>false, false)
    await new Promise((resolve, reject)=>{
        crawler({s3c}).s3Stream('s3://ericdmoore.com-images/*.png')
        .pipe(d.writeStream)
        .on('finish', resolve)
        .on('error', reject)
    })
    
    expect(d.getCount()).toBe(19)
    expect(d.getEntries().every((vf) => (vf as k.S3Item).Key?.endsWith('.png'))).toBe(true)
}, TIMEOUT )
  

test('Find *.svg from the network', async () => {
    const d = dest('Star SVGs', ()=>false, false)
    await new Promise((resolve, reject)=>{
        crawler({s3c}).vinylStream('s3://ericdmoore.com-images/*.svg')
        .pipe(d.writeStream)
        .on('finish', resolve)
        .on('error', reject)
    })
    
    expect(d.getCount()).toBe(3)
    expect(d.getEntries().every(vf => (vf as k.Vinyl).path?.endsWith('.svg'))).toBe(true)

}, TIMEOUT )