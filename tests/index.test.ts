import assert from 'assert'
import {ITestFunc, ITestResults, ITestModule} from './types'
// import * as utils from './utils'

// #region helpers


const print = async <T>(o:T)=>{
    console.log('...printing')
    if((o as unknown as {then: Function}).then){
        console.log(await o)
    }else{
        console.log(o)
    }
    return o
}

export const compare = async (i:number | 'skip', prior:ITestResults, message:string, a:unknown, e:unknown, using?: (a:unknown, e:unknown)=>boolean) => { 
    // dont mutate prior
    const newState: ITestResults = {
        skipped:[...prior.skipped], 
        failed:[...prior.failed], 
        passed:[...prior.passed]
    }
    if(i ==='skip'){
        newState.skipped.push(makeResult(__filename,0,message, message,e,a))
    }else{
        try{
            console.info(i, message)
            console.info(a)
            console.info(e)
            assert(a === e, `${message} @ line: ${i}`)
            newState.passed.push(makeResult(__filename, i,message, message,e,a))
        } catch(er){
            newState.failed.push(makeResult(__filename, i,message, message,e,a))
        }
    }
    console.log('check__37::', JSON.stringify({prior, newState},null, 2))
    return newState
}

export const skip = async (i:number | 'skip', prior:ITestResults, message:string, a:unknown, e:unknown, using?: (a:unknown, e:unknown)=>boolean) => { 
    // dont mutate prior
    const newState: ITestResults = {
        skipped:[...prior.skipped], 
        failed:[...prior.failed], 
        passed:[...prior.passed]
    }
    newState.skipped.push(makeResult(__filename, 0,message, message,e,a))
    return newState
}

export const runTests = (init:ITestResults, ...fns: ITestFunc[]) => 
    fns.reduce(async (p,fn,i) => fn(await p,i),Promise.resolve(init))

export const makeResult = (
    fileName:string,
    lineNo:number,
    testName: string,
    testMessage: string,
    expected: unknown,
    actual: unknown)=>({
        fileName,
        lineNo,
        testName,
        testMessage,
        expected,
        actual
    })

const testAll = async (testModule: unknown, prior:ITestResults):Promise<ITestResults> => 
    runTests(prior, ...Object.values(testModule as ITestModule))

// #endregion helpers

// main
;(async ()=>{
    const testPaths = ['./utils']
    const resultsAwaiting = testPaths
        .map(path => import(path))
        .map(async mod => await testAll(await mod, {passed:[],  failed:[], skipped:[]}))
    
    const results = await Promise.all(resultsAwaiting)
    console.log({ results })
})()

