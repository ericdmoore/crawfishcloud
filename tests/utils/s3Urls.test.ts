import type { ITestResults ,ITestFunc} from '../types'
//
import {runTests, compareInit, skipInit} from '../index.test'
import {s3ConfigToUrl, s3urlToConfig} from '../../index'

const t = compareInit(__filename)



const testToConfig:ITestFunc = async (p, i) =>{
    const tests : ITestFunc[] = [
        async (p,i)=>t(i, p, '', null, null)
    ]
    return runTests(p,...tests)
}


const testToString:ITestFunc = async (prior, i)=> {
    console.log('Suite: testToString')
    
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