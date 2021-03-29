# crawfishcloud

> A Streaming S3 Bucket Glob Crawler

![Deep Learning AI Generated Psychadelic Style Transfer Art of Crawfish painted with sunset clouds](/imgs/deepart2.jpg)

## Install

`npm i crawfishcloud`

## Setup

```js
import crawler, {asVfile} from 'crawfishcloud'
import {S3, SharedCredentials} from 'aws-sdk'

const creds = new SharedCredentials({profile: 'default'})
const s3c = new S3({creds})
const crawfish = crawler({s3:s3c}) // defaults to head
const crawfishBodies = crawler.body({s3:s3c},'/prefix/**/*.jpg')

```

## Usage

### Stream< Vfile | Vinyl >

```js
crawler.vfileStream({s3c},'/prefix/**/*.jpg').pipe(destination())
```

### Async Iterator

```js
for await (const vf of crawfishBodies.iter({body:true, using: asVfile}, 's3://Bucket/path/*.jpg' )){
  console.log({vf})
}
```

### Promise<Arrray<Vfile | Vinyl>>

```js
const allJpgs = await crawler.vinylArray({s3c},'s3://Bucket/path/*.jpg')
```

#### namesake
`crawfish cloud` because regular crawfish are delightful and they crawl around amongst the buckets - but crawfishcloud crawl in the cloud buckets.
