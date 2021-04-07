import { s3ConfigToUrl, s3urlToConfig } from "../../src/utils"

test('bijective - start str.1 ',()=>{
    const s = 's3://head/keepCalm?other=1&lastly=dood'
    const o = s3urlToConfig(s)
    expect(s3ConfigToUrl(o)).toEqual(s)
})
test('bijective start str.2',()=>{
    const s1 = 's3://BucketHead/crawfishtail/key.ext?Other=Stuff&last=bit'
    const o = s3urlToConfig(s1)
    const s2 = s3ConfigToUrl(o)
    expect(s2).toEqual(s1)
})

test('bijective start obj.1',()=>{
    const o1 = {Bucket:'bucket', Key:'key'}
    const s = s3ConfigToUrl(o1)
    const o2 = s3urlToConfig(s)
    expect(o1).toEqual(o2)
})

test('bijective start obj.2',()=>{
    const o1 = {Bucket:'bucket', Key:'key', otherThing:'1', lastly:'$'}
    const s = s3ConfigToUrl(o1)
    const o2 = s3urlToConfig(s)
    expect(o1).toEqual(o2)
})