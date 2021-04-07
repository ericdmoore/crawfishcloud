import { Readable } from 'stream'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import { drainReadable } from "../../src/exporters"
import {text} from '../fixtures/text'

test('read stream - and drain into a string.1 ',async ()=>{
    const r = createReadStream(resolve(__dirname, '../fixtures/text.ts'))
    const resultString = await drainReadable('::start::', r ,'::end::')
    expect(resultString.startsWith('::start::')).toBe(true)
    expect(resultString.endsWith('::end::')).toBe(true)
    // cant do len compare due to ts syntax terms `export const text = '<>'`
})

test('read stream - and drain into a string.2 ',async ()=>{ 
    const bumperTextLen = '::start::'.length + '::end::'.length
    const resultString = await drainReadable('::start::',Readable.from(text),'::end::')    
    
    expect(resultString.startsWith('::start::')).toBe(true)
    expect(resultString.endsWith('::end::')).toBe(true)
    expect(resultString).toHaveLength(text.length + bumperTextLen)
},10*1000)
