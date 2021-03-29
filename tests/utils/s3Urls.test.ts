import type {ITestResults , ITestFunc} from '../types'
//
import {runTests, compareInit, skipInit} from '../index.test'
import { s3ConfigToUrl, s3urlToConfig } from "../../src/utils"

const t = compareInit(__filename)
const skip = skipInit(__filename)


const testToConfig:ITestFunc = async (p, i) =>{
    const tests : ITestFunc[] = [
        async (p,i) => {
            const a = await s3urlToConfig('s3://BucketHead/crawfishtail/key.ext')
            const e = {
                Bucket:'BucketHead',
                Key:'/crawfishtail/key.ext'
            }
            return t(i, p, 'EZ - Convert String to HashMap', a,e)
        },    
        async (p,i) => { 
            const a = s3urlToConfig('s3://BucketHead/crawfishtail/key.ext?Other=Stuff&last=bit')
            const e = {
                Bucket:'BucketHead',
                Key:'/crawfishtail/key.ext',
                Other:'Stuff',
                last:'bit'
            }
            return t(i, p, 'Convert String to HashMap w/ Query Sttring',a, e)
        },
        async (p,i) => {
            const a = s3urlToConfig('s3://BucketHead')
            const e = {
                Bucket:'BucketHead',
                Key:'',
            }            
            return t(i, p, 'Missing Path/key', a,e)
        },
        async (p,i) => {
            const a = s3urlToConfig('s3://BucketHead/')
            const e = {
                Bucket:'BucketHead',
                Key:'/',
            }            
            return t(i, p, 'Missing Path/key but has slash', a,e)
        },
        async (p,i) => {
            const a = s3urlToConfig('s3://')
            const e = { Bucket:'',Key:''}
            return t(i, p, 'Missing Bucket', a,e)
        },

        async (p,i) => {
            // expect to throw error
            const TITLE = 'Rubbish input'
            let a = {}
            const e = null // throw error
            try{
                a = s3urlToConfig('asdfg')
            } catch(er){
                return t(i, p, TITLE, true,true)
            }
            return t(i, p, TITLE, false,true)
        }
    ]
    return runTests(p,...tests)
}

const testToString:ITestFunc = async (prior, i)=> {
    // console.log('Suite: testToString')
    const tests: ITestFunc[] =[
        (p, i) => t(i,p,
            'basic',
            s3ConfigToUrl({Bucket:'head', Key:'keepCalm'}), 
            's3://head/keepCalm'
        ),
        (p:ITestResults, i:number) => t(i,p,
            'extra vars',
            s3ConfigToUrl({Bucket:'head', Key:'keepCalm', other:'1', lastly:'dood'}),
            's3://head/keepCalm?other=1&lastly=dood'
        )
    ]
    return runTests(prior, ...tests) 
}

export const test:ITestFunc = async (prior)=>{
    console.log(__filename)
    const tests = [
        testToString,
        testToConfig,
    ]
    const newState = runTests(prior,...tests)
    return newState
}