# crawfishcloud
A Streaming S3 Bucket Glob Crawler

## Setup

```js
import crawler from 'crawfishcloud'
import {S3, SharedCredentials} from 'aws-sdk'
import vfile from 'vfile'

const StoVfile 
const creds = new SharedCredentials({profile: 'default'})
const s3c = new S3({creds})
const crawfishHeads = crawler({s3:s3c}) // defaults to head
const crawfishBodies = crawler.body({ s3:s3c, filters:['/prefix/**/.jpg'], as:'vfile' | 'vinyl' })
```

## Usage

### Stream< Vfile | Vinyl >

### Async Iterator

### Promise<Arrray<Vfile | Vinyl>>
