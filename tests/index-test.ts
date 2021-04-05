import process from 'process'
import chalk from 'chalk'
import isEqual from 'lodash.isequal'
import {ITestFunc, ITestResults, ITestModule, AsyncComparator, MaybePromise} from './types'

//
import * as iterTests from './iter/iter.test'
import * as allTests from './stream/stream.test'
import * as streamTests from './all/all.test'

const testModules = [
    iterTests,
    allTests,
    streamTests
]

// #region helpers

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

export const testResultsInit = () => ({passed:[],  failed:[], skipped:[]})

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
        using: AsyncComparator = async (a,e)=> {const [act, exp] = await Promise.all([a,e]); return isEqual(act, exp)}
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
        
        const condition = await using (a, e).catch( er => { 
            newState.failed.push(makeResult(fileName, i,message, message,e,a))
            return false
        })

        if(condition){
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


export const runTests = async (init:ITestResults, funcNames:string[], ...fns: ITestFunc[]) => {
    return fns.reduce( 
        async (p,testFn,i) => {
            
            const priorState = await p.catch(er => {
                console.error(er)
                throw new Error('ERR while resolving newState')
            })
            
            console.log('runTests1:', {priorState})

            const newState = await testFn(priorState,i).catch( er => {
                console.error(er, p, i, testFn)
                const funcName = funcNames[i]
                priorState.failed.push(makeResult(
                    funcName, i, 
                    `${funcName} failed to resolve with a new State`, 
                    'full details could not be provided', 
                    true, false))
                return priorState
            })
            console.log('runTests2:', {newState})
            return newState

        }, Promise.resolve(init)
    ).catch( er => {
        console.error(er)
        throw new Error('Error found in run Tests')
    })
}


const testAll = async (testModule: unknown, prior:ITestResults):Promise<ITestResults> => {
    // console.log({testModule, fns: Object.values(testModule as ITestModule) })
    const mod = testModule as ITestModule
    const modKeys = Object.keys(mod)
    return runTests(prior, modKeys, ...Object.values(mod))
}

const reporter = (results:ITestResults, startTime:number = Date.now())=>{
    // console.log("reporter.results:",results, {startTime})

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

    // get some gliob pattterns from CLI
    // const globStrings = []
    // 
    // then expand the glob pattenrs against the fs
    // 


    const modulePaths = [
        // because utils is a `supernode` root node of other exported tests it is a
        // './utils/',
        // './utils/testharnessHelpers.test.ts',
        // './utils/s3Urls.test.ts',
        './iter/iter.test.ts',
        // './all/all.test.ts',
        // './stream/stream.test.ts'
    ]
    
    // parent module
    console.log({ modulePaths })
    
    const init = testResultsInit()
    const startTime = Date.now()

    // const testModules = await Promise.all([iterTests])
    // const testModules = await Promise.all(modulePaths.map(path => import(path)))
    
    const resultsAwaiting = await Promise.all(
        testModules.map(async mod => {
            const m = await mod
            console.log({m})

            const allTestResults = await testAll(m, init)
            return allTestResults
        })
    )

    const resultingArr = await Promise.all(resultsAwaiting)
        .catch(er=>{
                console.error('error in mainIIFE:\n\n',er)
                return [] as ITestResults[]
        }).catch(er=>console.error('promise.all',er))
    
    const results = (resultingArr||[]).reduce((p,c,i)=>({
         passed:[...p.passed, ...c.passed],
         failed:[...p.failed, ...c.failed],
         skipped:[...p.skipped, ...c.skipped],
    }), init)

    console.log('IIFE.print', JSON.stringify(results,null, 2), {startTime})
    reporter(results, startTime)
})()        
