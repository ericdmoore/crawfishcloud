import type { ITestResults, ITestFunc } from '../types'
//
import {makeResult, runTests, compareInit, skipInit} from '../index-test'


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
export const accumulationTests:ITestFunc = async (p,i)=>{
        
    // this tests adds one of each (P,F,S) to the localPrior
    const localPrior:ITestResults = { passed:[], failed:[],skipped:[]}
    const tests:ITestFunc[] = [
        addPassingTest,
        addPassingTest,
        addSkippedTest,
        addFailingTest
    ]
    const testNames =[
        'addPassingTest',
        'addPassingTest',
        'addSkippedTest',
        'addFailingTest'
    ]
    const newLocalState = await runTests(localPrior, testNames, ...tests)
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
}

/**
 * A Test for compare 
 */
export const compareTests:ITestFunc = async (p,i)=>{
    const localPrior:ITestResults = {failed:[], passed:[], skipped:[]}
    const a = 1
    const e = 1


    // usually this is handled in the compare func
    const testDtl = makeResult(__filename, i, 'basic passing test','should increment `tests that passed`',a,e)
    const newState = await compareInit(__filename)(i,localPrior, 'basic Compare', a, e)

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
    

/**
 * A Test for skip 
 */
export const skipTests:ITestFunc = async (p,i)=>{    
    const localPrior:ITestResults = {failed:[], passed:[], skipped:[]}
    const newLocalState = await runTests(localPrior, ['skipfunc'], async (p,i) => skipInit(__filename)(i,p,'Skipping',null, null))

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