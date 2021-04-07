/* istanbul ignore file */

import process from 'process'
import {S3, Credentials, SharedIniFileCredentials} from 'aws-sdk'

// @ref https://github.com/ericdmoore/crawfishcloud/settings/secrets/actions to see the keys used
const key: string | undefined = process.env?.PERSONAL_DEFAULT_AWS_KEY
const secret: string | undefined = process.env?.PERSONAL_DEFAULT_AWS_SECRET

const credentials = (key && secret)
    ? new Credentials({accessKeyId:key, secretAccessKey:secret}) 
    : new SharedIniFileCredentials({profile:'personal_default'})

if(key && secret){
    // CI ENV
    console.log('...using ENV VARS')
} else{
    // Local 
    console.log('...using AWS Cred file')
}

const s3c = new S3({credentials})

export default s3c
