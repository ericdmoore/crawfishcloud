import type {ITestResults , ITestFunc} from '../types'
//
import {Writable} from 'stream'
import {runTests, compareInit, skipInit} from '../index.test'
import crawler, {asVfile}  from "../../src/index"

import s3c from '../aws'
const t = compareInit(__filename)
// const skip = skipInit(__filename)

let writeCount = 0
const dest = ( name:string ) => {return new Writable({
    objectMode:true,
    write: function(chunk, enc, cb){ 
        writeCount++
        if(writeCount % 5 ===0 ) console.log(name, writeCount, {chunk})
        cb()
    },
    final: function(cb){
        console.log(name, {writeCount})
        cb()
    }
})}

export const test:ITestFunc = async (prior, i)=> {
    console.log(__filename)
    const tests: ITestFunc[] =[
        async (p, i) => {
            return new Promise((resolve, reject)=>{
                crawler({s3c}).vfileStream('s3://ericdmoore.com-images/a*.jpg')
                  .pipe(dest('a* JPGS'))
                  .on('close',()=>resolve(t(i,p, 'Find a*.jpg from the network', true, true)))
                  .on('error',(er)=>reject(er))
            })
        },
        async (p, i) => {
            return new Promise((resolve, reject)=>{
                crawler({s3c}).vfileStream('s3://ericdmoore.com-images/*.png')
                  .pipe(dest('all PNGs'))
                  .on('close',()=>resolve(t(i,p, 'Find PNGs from the network', true, true)))
                  .on('error',(er)=>reject(er))
            })
        },
        async (p, i) => {
            return new Promise((resolve, reject)=>{
                crawler({s3c}).vinylStream('s3://ericdmoore.com-images/*.svg')
                  .pipe(dest('all SVGs'))
                  .on('close',()=>resolve(t(i,p, 'Find PNGs from the network', true, true)))
                  .on('error',(er)=>reject(er))
            })
        },
    ]
    return runTests(prior, ...tests) 
}