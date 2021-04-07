import { Readable } from 'stream'
import { createReadStream } from 'fs'
import { drainReadable } from "../../src/exporters"
import {text, len} from '../fixtures/text'

test('read stream - and drain into a string.1 ',async ()=>{
    const r = createReadStream('../fixtures/text.ts')
    const resultString = await drainReadable('::start::',r,'::end::')
    expect(resultString.startsWith('::start::')).toBe(true)
    expect(resultString.endsWith('::end::')).toBe(true)
    expect(resultString).toHaveLength(len + '::start::'.length + '::end::'.length)
})

test('read stream - and drain into a string.1 ',async ()=>{
    const resultString = await drainReadable('::start::',Readable.from(text),'::end::')
    expect(resultString.startsWith('::start::')).toBe(true)
    expect(resultString.endsWith('::end::')).toBe(true)
    expect(resultString).toHaveLength(len + '::start::'.length + '::end::'.length)
})
