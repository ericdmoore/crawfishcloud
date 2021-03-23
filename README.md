# crawfishcloud
A Streaming S3 Bucket Glob Crawler

## Setup

```js
import crawler from 'crawfishcloud'
import {S3, SharedCredentials} from 'aws-sdk'
import vfile from 'vfile'

const asVfile = (s3Item) => vfile({path:s3Item.Key, contents: s3Item.Body})
const creds = new SharedCredentials({profile: 'default'})
const s3c = new S3({creds})
const crawfishHeads = crawler({s3:s3c}) // defaults to head
const crawfishBodies = crawler.body({ s3:s3c, filters:['/prefix/**/.jpg'], as:'vfile' | 'vinyl' | asVfile })
```

## Usage

### Stream< Vfile | Vinyl >

### Async Iterator

### Promise<Arrray<Vfile | Vinyl>>
