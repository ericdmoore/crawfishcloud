import type { ITestResults, ITestFunc } from '../types'
//
import {makeResult, runTests, compare, skip} from '../index.test'


const addPassingTest:ITestFunc = async (p,i)=>({
    failed:[...p.failed], 
    skipped:[...p.skipped],
    passed: [...p.passed, makeResult(
        __filename, 1, 
        'Contrived Test', 'passing by defintion',
        ';)',';)'
    )], 
    
})


const addFailingTest:ITestFunc = async (p,i)=>({
    passed: [...p.passed], 
    skipped:[...p.skipped],
    failed:[...p.failed,makeResult(
        __filename, 1, 
        'Contrived Test', 'Failing by defintion',
        ':(',':('
    )]
})


const addSkippedTest:ITestFunc = async (p,i)=>({
    passed: [...p.passed], 
    failed:[...p.failed], 
    skipped:[...p.skipped,makeResult(
        __filename, 1, 
        'Contrived Test', 'Skipped by defintion',
        ':P',':P'
    )]
})


/**
 * A Test for runTest 
 */
const accumulationTests:ITestFunc = async (p,i)=>{
    const tests: ITestFunc[] = [
        async (p,i)=>{
            // this tests adds one of each (P,F,S) to the localPrior
            const localPrior:ITestResults = { passed:[], failed:[],skipped:[]}
            const tests:ITestFunc[] = [
                addPassingTest,
                addPassingTest,
                addSkippedTest,
                addFailingTest
            ]
            const newLocalState = await runTests(localPrior, ...tests)
            const checkPassed = newLocalState.passed.length === 2
            const checkFailed = newLocalState.failed.length === 1
            const checkSkipped = newLocalState.skipped.length === 1

            if(checkFailed && checkPassed && checkSkipped){
                return {
                    failed: [...p.failed], 
                    skipped:[...p.skipped], 
                    passed:[...p.passed, makeResult(__filename, i, 'Accumulator Test1', 'accumulate a 211', newLocalState, true) ]
                }
            }else{
                return {
                    skipped:[...p.skipped], 
                    passed:[...p.passed],
                    failed: [...p.failed, makeResult(__filename, i, 'Accumulator Test1', 'accumulate a 211', newLocalState, false)]
                }   
            }
        },
    ]
    const newState = await runTests(p, ...tests)
    return newState
}

/**
 * A Test for compare 
 */
const compareTests:ITestFunc = async (p,i)=>{
    const tests: ITestFunc[] = [
        async (p,i)=>{
            const localPrior:ITestResults = {failed:[], passed:[], skipped:[]}
            const a = 1
            const e = 1


            // usually this is handled in the compare func
            const testDtl = makeResult(__filename, i, 'basic passing test','should increment `tests that passed`',a,e)
            const newState = await compare(__filename)(i,localPrior, 'basic Compare', a, e)

            // did the compare func work?
            if(newState.passed.length = 1){
                return {
                    passed:[...p.passed, testDtl], 
                    failed:[...p.failed], 
                    skipped:[...p.skipped]
                }
            } else{
                return {
                    passed:[...p.passed], 
                    failed:[...p.failed, testDtl], 
                    skipped:[...p.skipped]
                }
            }
        }
    ]
    return runTests(p, ...tests)
}

/**
 * A Test for skip 
 */
const skipTests:ITestFunc = async (p,i)=>{
    const tests: ITestFunc[] = [
        async (p,i)=>{
            const localPrior:ITestResults = {failed:[], passed:[], skipped:[]}
            const newLocalState = await runTests(localPrior, async (p,i) => skip(__filename)(i,p,'Skipping',null, null))
            
            const testdtl = makeResult(__filename, i, 'Verifying Skip', 'Verify Skip will Skip',null, null)
            if(newLocalState.skipped.length ===1){
                return { 
                    // skip did what it should - it "skipped" thus that is a pass
                    passed:[...p.passed, testdtl],
                    failed:[...p.failed], 
                    skipped:[...p.skipped]
                }
            }else{
                return { 
                    // skip did not "skip" thus that is a fail
                    passed:[...p.passed], 
                    failed:[...p.failed, testdtl],
                    skipped:[...p.skipped]
                }
            }
        }
    ]
    return runTests(p,...tests)
}



export const test = async (prior: ITestResults)=>{
    console.log(__filename)
    const tests: ITestFunc[] = [
        accumulationTests,
        compareTests,
        skipTests
    ]
    const newState = runTests(prior, ...tests)
    return newState
}