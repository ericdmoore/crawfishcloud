/* globals test */
import crawler, {asS3} from "../../src/index"

import {S3, SharedIniFileCredentials} from 'aws-sdk'
const credentials = new SharedIniFileCredentials({profile:'personal_default'})
const s3c = new S3({credentials, region:'us-west-2'})

const TIMEOUT = 30 * 1000

test('Find JPGs from the network',async ()=>{
    let count = 0
    for await(const vf of crawler({s3c}).vfileIter('s3://ericdmoore.com-images/a*.jpg')){ 
        count++
    }
    // incase of drifting network fixtures
    // aws s3 ls 's3://ericdmoore.com-images/a' --profile='personal_default' | grep 'a*.jpg' | wc -l
    expect(count).toBe(26)
},TIMEOUT)


test('Find JPGs from the network w/ forced pagination',async ()=>{
    let count = 0
    for await(const vf of crawler({s3c, maxkeys: 15}).vinylIter('s3://ericdmoore.com-images/a*.jpg')){ 
        count++
    }
    // incase of drifting network fixtures
    // aws s3 ls 's3://ericdmoore.com-images/a' --profile='personal_default' | grep 'a*.jpg' | wc -l
    expect(count).toBe(26)
},TIMEOUT)



test('Find JPGs paths (HEADs) from the network w/ forced pagination',async ()=>{
    let count = 0
    for await(const vf of crawler({s3c, maxkeys:15}).iter({body:false, using: asS3},'s3://ericdmoore.com-images/a*.jpg')){ 
        count++
    }
    // incase of drifting network fixtures
    // aws s3 ls 's3://ericdmoore.com-images/a' --profile='personal_default' | grep 'a*.jpg' | wc -l
    expect(count).toBe(26)
},TIMEOUT)

test('Find PNGs from the network',async ()=>{
    let count = 0
    for await(const v of crawler({s3c}).s3Iter('s3://ericdmoore.com-images/*.png')){ 
        count++ 
        // console.log(v.path)
    }
    expect(count).toBe(19)
},TIMEOUT)
    

test('Find SVGs from the network', async ()=>{
    let count = 0
    for await(const vf of crawler({s3c}).vfileIter('s3://ericdmoore.com-images/*.svg')){ 
        count++ 
        // console.log(vf)
    }
    expect(count).toBe(3)
},TIMEOUT)





