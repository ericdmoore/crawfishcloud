import  {asVfile} from './exporters'
import { S3 } from 'aws-sdk'
import crawler from './crawfishcloud'
export default crawler

const r = crawler({s3c: new S3()}, 's3://Bucket/path/**/*.jpg').all({body:true, using: asVfile})

export {asVfile, asVinyl} from './exporters'
export {crawler} from './crawfishcloud'
