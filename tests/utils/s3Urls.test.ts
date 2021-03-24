import type { ITestResults ,ITestFunc} from '../index.test'
//
import {runTests, compare, skip} from '../index.test'
import {s3ConfigToUrl, s3urlToConfig,} from '../../index'

    
const testToConfig:ITestFunc = async (priorState, i) =>[
    (p:ITestResults, i:number) => p
].reduce(
    async (p,fn,i)=>fn(await p,i)
    ,Promise.resolve(priorState)
)


// const makeTest = ()=>{}

const testToString:ITestFunc = async (prior, i)=> {
    console.log('Suite: testToString')
    const tests = [
        (p:ITestResults, i:number) => compare(
            i,p,'basic',
            s3ConfigToUrl({Bucket:'head', Key:'keepCalm'}), 
            's3://head/keepCalm'
        ),
        (p:ITestResults, i:number) => compare( 
            i,p,'extra vars',
            s3ConfigToUrl({Bucket:'head', Key:'keepCalm', other:'1', lastly:'dood'}),
            's3://head/keepCalm?other=1&lastly=dood'
        )
    ]
    const newState = runTests(prior, ...tests)
    console.log('s3urls__32:',JSON.stringify({prior, newState},null, 2))
    return newState
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
export default test