import process from 'process'
import chalk from 'chalk'
import isEqual from 'lodash.isequal'
import {ITestFunc, ITestResults, ITestModule, AsyncComparator, MaybePromise} from './types'


// #region helpers
/**
 * Compare Init
 * @param fileName 
 * @todo - implement using comparator func
 */
export const compareInit = (fileName:string) => async (
        i:number | 'skip',  
        prior:ITestResults, 
        message:string, 
        a: MaybePromise<unknown>,
        e: MaybePromise<unknown>, 
        using: AsyncComparator = async (a,e)=> isEqual(await a, await e)
    ) => { 
    
    // dont mutate prior
    const newState: ITestResults = {
        skipped:[...prior.skipped], 
        failed:[...prior.failed], 
        passed:[...prior.passed]
    }
    if(i ==='skip'){
        newState.skipped.push(makeResult(fileName,0,message, message,e,a))
    }else{
        if( await using (a, e)){
            newState.passed.push(makeResult(fileName, i,message, message,e,a))
        }else{
            newState.failed.push(makeResult(fileName, i,message, message,e,a))
        }
    }
    return newState
}

export const skipInit = (fileName:string) => async (
    i:number | 'skip',  prior:ITestResults, 
    message:string, 
    a: MaybePromise<unknown>,
    e: MaybePromise<unknown>, 
    using: AsyncComparator = async (a,e)=> await a === await e ) => 
        compareInit(fileName)('skip',prior, message, a, e, using)

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
    const elapsedTime = (Date.now()-startTime)/1000
    const totalTestNum = results.passed.length + results.failed.length + results.skipped.length

    console.log(`\n
    elapsedTime: ${elapsedTime}s
    projected time @1000 tests: ${ Math.floor(elapsedTime / totalTestNum * 1000)}s
    ✅ passed: ${results.passed.length}
    ❌ failed: ${results.failed.length}
    ⛱ skipped: ${results.skipped.length}
    `)
    // also prints
    
    results.failed.map(t=>console.log(`❌ at ${t.fileName}:${t.lineNo}:1 : ${t.testName}`))
    results.skipped.map(t=>console.log(`⛱  at ${t.fileName}:${t.lineNo}:1 : ${t.testName}`))
    results.passed.map(t=>console.log(`✅ ${t.fileName}: ${t.testName}`))
    if(results.failed.length > 0 ){
        process.exitCode = 1
        results.failed.map(t => {
            // console.log(JSON.stringify(t, null, 2))
            console.log(chalk.black.bgWhite(t.fileName))
            console.log(chalk.red(t.testName))
            console.log(chalk.red('actual:\n', JSON.stringify(t.actual,null,2)))
            console.log(chalk.green('expected:\n', JSON.stringify(t.expected ,null,2)))
        })
    }
}
    

// #endregion helpers

/** MAIN IIFEs
 * @todo Alter path strings such that a JS build can adapt to find its kind in plain node.
 */
;(async ()=>{
    const testPaths = [
        // because utils is a `supernode` root node of other exported tests it is a
        // './utils/',
        './utils/testharnessHelpers.test.ts',
        './utils/s3Urls.test.ts',
        './iter/iter.test.ts',
        './all/all.test.ts',
        // './stream/stream.test.ts'
    ]
    
    // parent module
    console.log({ testPaths })
    const init = {passed:[],  failed:[], skipped:[]}

    const startTime = Date.now()

    const resultsAwaiting = testPaths
        .map(path => import(path))
        .map(async mod => await testAll(await mod, init ))
        
    const resultingArr = await Promise.all(resultsAwaiting)
        .catch(er=>{ 
                console.error('error in mainIIFE:\n\n',er)
                return [] as ITestResults[]
        })
    
    const results = resultingArr.reduce((p,c,i)=>({
         passed:[...p.passed, ...c.passed],
         failed:[...p.failed, ...c.failed],
         skipped:[...p.skipped, ...c.skipped],
    }), init)
    
    reporter(results, startTime)
})()        
