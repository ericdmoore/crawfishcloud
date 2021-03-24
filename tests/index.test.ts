import assert from 'assert'
import { start } from 'node:repl'
import {ITestFunc, ITestResults, ITestModule} from './types'
// import * as utils from './utils'

// #region helpers


// const print = async <T>(o:T)=>{
//     console.log('...printing')
//     if((o as unknown as {then: Function}).then){
//         console.log(await o)
//     }else{
//         console.log(o)
//     }
//     return o
// }

export const compare = (fileName:string) => async (i:number | 'skip',  prior:ITestResults, message:string, a:unknown, e:unknown, using?: (a:unknown, e:unknown)=>boolean) => { 
    // dont mutate prior
    const newState: ITestResults = {
        skipped:[...prior.skipped], 
        failed:[...prior.failed], 
        passed:[...prior.passed]
    }
    if(i ==='skip'){
        newState.skipped.push(makeResult(fileName,0,message, message,e,a))
    }else{
        try{
            // console.info(i, message)
            // console.info(a)
            // console.info(e)
            assert(a === e, `${message} @ line: ${i}`)
            newState.passed.push(makeResult(fileName, i,message, message,e,a))
        } catch(er){
            newState.failed.push(makeResult(fileName, i,message, message,e,a))
        }
    }
    // console.log('check__37::', JSON.stringify({prior, newState},null, 2))
    return newState
}

export const skip = (fileName:string) => async (i:number | 'skip', prior:ITestResults, message:string, a:unknown, e:unknown, using?: (a:unknown, e:unknown)=>boolean) => { 
    // dont mutate prior
    const newState: ITestResults = {
        skipped:[...prior.skipped], 
        failed:[...prior.failed], 
        passed:[...prior.passed]
    }
    newState.skipped.push(makeResult(fileName, 0,message, message,e,a))
    return newState
}

export const runTests = (init:ITestResults, ...fns: ITestFunc[]) => 
    fns.reduce(async (p,fn,i) => {
        return fn(await p,i)
    }, Promise.resolve(init))

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

const testAll = async (testModule: unknown, prior:ITestResults):Promise<ITestResults> => {
    // console.log({testModule, fns: Object.values(testModule as ITestModule) })
    return runTests(prior, ...Object.values(testModule as ITestModule)) 
}

const reporter = (results:ITestResults, startTime:number = Date.now())=>{
    const totalTestNum = results.passed.length + results.failed.length + results.skipped.length
    const elapsedTime = (Date.now()-startTime)/1000

    console.log(`\n\n
    elapsedTime: ${elapsedTime}
    Avg Test Time: ${totalTestNum / elapsedTime}
    passed: ${results.passed.length}
    failed: ${results.failed.length}
    skipped: ${results.skipped.length}
    `)
    results.failed.map(t=>console.log(`❌ at ${t.fileName}:${t.lineNo}:1 : ${t.testName}`))
    results.skipped.map(t=>console.log(`⛱  at ${t.fileName}:${t.lineNo}:1 : ${t.testName}`))
    results.passed.map(t=>console.log(`✅ ${t.fileName}: ${t.testName}`))
}
    

// #endregion helpers

/** MAIN IIFE
 * @todo Alter path strings such that a JS build can adapt to find its kind in plain node.
 */
;(async ()=>{
    const testPaths = [
        // './utils/',
        './utils/testharnessHelpers.test.ts',
        './utils/s3Urls.test.ts'
        // adapt
    ]
    // because util is a root node of other exported tests it is a `supernode`
    // parent module
    console.log({ testPaths })
    const init = {passed:[],  failed:[], skipped:[]}

    const startTime = Date.now()
    const resultsAwaiting = testPaths
        .map(path => import(path))
        .map(async mod => await testAll(await mod, init ))
        
    
    const resultingArr = await Promise.all(resultsAwaiting)
        .catch(er=>{ 
                console.error('mainIIFE:\n\n',er)
                return [] as ITestResults[]
        })
    
    const results = resultingArr.reduce((p,c,i)=>({
         passed:[...p.passed, ...c.passed],
         failed:[...p.failed, ...c.failed],
         skipped:[...p.skipped, ...c.skipped],
    }), init)
    
    const totalTestNum = results.passed.length + results.failed.length + results.skipped.length
    const elapsedTime = (Date.now()-startTime)/1000
    reporter(results, startTime)
})()        

