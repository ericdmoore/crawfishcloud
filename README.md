# crawfishcloud

A Streaming S3 Bucket Glob Crawler

## Install

`npm i crawfishcloud`

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

```js
crawfishBodies.stream().pipe(destStream())
```

### Async Iterator

```js
for await (const vf of crawfishBodies.iter()){
  console.log({vf})
}
```

### Promise<Arrray<Vfile | Vinyl>>

```js
const allJpgs = await crawfishBodies.all()
```

#### namesake
`crawfish cloud` because regular crawfish are delightful and they crawl around amongst the buckets - but crawfishcloud crawl in the cloud buckets.
