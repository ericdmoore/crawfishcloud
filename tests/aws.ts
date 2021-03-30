import {S3, SharedIniFileCredentials} from 'aws-sdk'

const credentials = new SharedIniFileCredentials({profile:'personal_default'})
export const s3c = new S3({credentials, region:'us-west-2'})
export default s3c
