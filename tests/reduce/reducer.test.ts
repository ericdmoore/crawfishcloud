/* globals test */
import crawler, {asS3} from "../../src/index"
import s3c from '../aws'

const TIMEOUT = 40 * 1000

test('Find JPGs from the network', async ()=>{
    // aws s3 ls 's3://ericdmoore.com-images/a' --profile='personal_default' | grep 'a*.jpg' | wc -l
    const count = await crawler({s3c, maxkeys:15},'s3://ericdmoore.com-images/a*.jpg')
        .reduce(0, asS3, (p) => p+1)
    expect(count).toBe(26)
},TIMEOUT)


test('Find JPGs from the network', async ()=>{
    // aws s3 ls 's3://ericdmoore.com-images/a' --profile='personal_default' | grep 'a*.jpg' | wc -l
    const count = await crawler({s3c})
        .reduce(0, asS3, (p)=>p+1, 's3://ericdmoore.com-images/a*.jpg')
    expect(count).toBe(26)
},TIMEOUT)