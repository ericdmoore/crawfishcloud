import type { ITestResults, ITestFunc } from '../types'
//
import {makeResult, runTests, compare, skip} from '../index.test'

/**
 * A Test for runTest 
 */
const accumulationTests:ITestFunc = async (p,i)=>{
    const tests: ITestFunc[] = [
        async (p,i)=>{return p},
    ]
    return p
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

            const testDtl = makeResult(__filename, i, 'basic passing test','should increment `tests that passed`',a,e)
            const newState = await compare(i, localPrior, 'basic Compare', a, e)

            // did the compare func work?
            if(newState.passed.length = 1){
                p.passed.push(testDtl)
            } else{
                p.failed.push(testDtl)
            }
            return p
        }
    ]
    return p
}

/**
 * A Test for skip 
 */
const skipTests:ITestFunc = async (p,i)=>{
    const tests: ITestFunc[] = [
        async (p,i)=>{return p},
        async (p,i)=>{return p},
    ]
    return p
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
