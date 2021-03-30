import type {ITestResults , ITestFunc} from '../types'
//
import {runTests, compareInit, skipInit} from '../index.test'
import crawler from "../../src/index"
import s3c from '../aws'

const t = compareInit(__filename)
// const skip = skipInit(__filename)

export const test:ITestFunc = async (prior, i)=> {
    console.log(__filename)
    const tests: ITestFunc[] =[
        async (p, i) => {
            const ret = await crawler({s3c}).vfileArray('s3://ericdmoore.com-images/*.jpg')
            return t(i,p, 'Find JPGs from the network',
                ret.every((vf) => vf.path?.endsWith('.jpg')),
                true
            )
        },
        async (p, i) => {
            const ret = await crawler({s3c}).vfileArray('s3://ericdmoore.com-images/*.png')
            return t(i,p, 'Find PNGs from the network',
                ret.every((vf) => vf.path?.endsWith('.png')),
                true
            )
        },
        async (p, i) => {
            const ret = await crawler({s3c}).vinylArray('s3://ericdmoore.com-images/*.svg')
            return t(i,p, 'Find SVGs from the network',
                ret.every((v) => v.path.endsWith('.svg')),
                true
            )
        }
    ]
    return runTests(prior, ...tests) 
}