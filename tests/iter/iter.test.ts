import type {ITestResults , ITestFunc} from '../types'
//
import {runTests, compareInit, skipInit} from '../index.test'
import crawler, {asVfile}  from "../../src/index"
import s3c from '../aws'

const t = compareInit(__filename)
// const skip = skipInit(__filename)

export const test:ITestFunc = async (prior, i)=> {
    console.log(__filename)
    const tests: ITestFunc[] =[
        async (p, i) => {
            let count = 0
            for await(const vf of crawler({s3c}).vfileIter('s3://ericdmoore.com-images/a*.jpg')){ count++ }
            return t(i,p, 'Find JPGs from the network', count, 36)
        },
        async (p, i) => {
            let count = 0
            for await(const vf of crawler({s3c}).vinylIter('s3://ericdmoore.com-images/*.png')){ count++ }
            return t(i,p, 'Find PNGs from the network', count, 19)
        },
        async (p, i) => {
            let count = 0
            for await(const vf of crawler({s3c}).vfileIter('s3://ericdmoore.com-images/*.svg')){ count++ }
            return t(i,p, 'Find SVGs from the network', count, 3)
        }
    ]
    return runTests(prior, ...tests) 
}