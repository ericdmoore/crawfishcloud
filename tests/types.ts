export interface ITestReturn{
    fileName:string
    lineNo:number
    testName: string
    testMessage: string
    expected: unknown
    actual: unknown
}

export type ITestResultsP = Promise<ITestReturn>

export interface ITestResults {
    failed:ITestReturn[], 
    passed:ITestReturn[], 
    skipped:ITestReturn[]
}
export type ITestFunc = (prior:ITestResults, i: number) => Promise<ITestResults>

export interface ITestModule{
    [testFn:string]: ITestFunc
}