import type {ITestResults , ITestFunc} from '../types'
//
// import {runTests, compareInit, skipInit} from '../index.test'
import { s3ConfigToUrl, s3urlToConfig } from "../../src/utils"

// const t = compareInit(__filename)
// const skip = skipInit(__filename)


// export const ezTest: ITestFunc = async (p,i) => {
//     const a = await s3urlToConfig('s3://BucketHead/crawfishtail/key.ext')
//     const e = {
//         Bucket:'BucketHead',
//         Key:'/crawfishtail/key.ext'
//     }
//     return t(i, p, 'EZ - Convert String to HashMap', a,e)
// }
// export const testWithExtras: ITestFunc = async (p,i) => { 
//     const a = s3urlToConfig('s3://BucketHead/crawfishtail/key.ext?Other=Stuff&last=bit')
//     const e = {
//         Bucket:'BucketHead',
//         Key:'/crawfishtail/key.ext',
//         Other:'Stuff',
//         last:'bit'
//     }
//     return t(i, p, 'Convert String to HashMap w/ Query Sttring',a, e)
// }
// export const missingKeyTEst: ITestFunc = async (p,i) => {
//     const a = s3urlToConfig('s3://BucketHead')
//     const e = {
//         Bucket:'BucketHead',
//         Key:'',
//     }            
//     return t(i, p, 'Missing Path/key', a,e)
// }
// export const slashPath: ITestFunc = async (p,i) => {
//     const a = s3urlToConfig('s3://BucketHead/')
//     const e = {
//         Bucket:'BucketHead',
//         Key:'/',
//     }            
//     return t(i, p, 'Missing Path/key but has slash', a,e)
// }
// export const missingBucket: ITestFunc = async (p,i) => {
//     const a = s3urlToConfig('s3://')
//     const e = { Bucket:'',Key:''}
//     return t(i, p, 'Missing Bucket', a,e)
// }
// export const badInput: ITestFunc = async (p,i) => {
//     // expect to throw error
//     const TITLE = 'Rubbish input'
//     let a = {}
//     const e = null // throw error
//     try{
//         a = s3urlToConfig('asdfg')
//     } catch(er){
//         return t(i, p, TITLE, true,true)
//     }
//     return t(i, p, TITLE, false,true)
// }
// export const basicToString: ITestFunc = async (p, i) => t(i,p,
//     'basic',
//     s3ConfigToUrl({Bucket:'head', Key:'keepCalm'}), 
//     's3://head/keepCalm'
// )
// export const toStringWithParams: ITestFunc = async (p, i) => t(i,p,
//     'extra vars',
//     s3ConfigToUrl({Bucket:'head', Key:'keepCalm', other:'1', lastly:'dood'}),
   
// )

test('bijective - start str.1 ',()=>{
    const s = 's3://head/keepCalm?other=1&lastly=dood'
    const o = s3urlToConfig(s)
    expect(s3ConfigToUrl(o)).toEqual(s)
})
test('bijective start str.2',()=>{
    const s1 = 's3://BucketHead/crawfishtail/key.ext?Other=Stuff&last=bit'
    const o = s3urlToConfig(s1)
    const s2 = s3ConfigToUrl(o)
    expect(s2).toEqual(s1)
})

test('bijective start obj.1',()=>{
    const o1 = {Bucket:'bucket', Key:'key'}
    const s = s3ConfigToUrl(o1)
    const o2 = s3urlToConfig(s)
    expect(o1).toEqual(o2)
})

test('bijective start obj.2',()=>{
    const o1 = {Bucket:'bucket', Key:'key', otherThing:'1', lastly:'$'}
    const s = s3ConfigToUrl(o1)
    const o2 = s3urlToConfig(s)
    expect(o1).toEqual(o2)
})