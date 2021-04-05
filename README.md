# crawfishcloud

> A Streaming S3 Bucket Glob Crawler

![Deep Learning AI Generated Psychadelic Style Transfer Art of Crawfish painted with sunset clouds](/imgs/deepart2.jpg)

## Install

`npm i crawfishcloud`

## Setup

```js
import crawler, {asVfile} from 'crawfishcloud'
import {S3, SharedIniFileCredentials} from 'aws-sdk'

const creds = new SharedCredentials({profile: 'default'})
const crawfish = crawler({s3:new S3({creds})}) // defaults to head

```

## Usage

### Stream< Vfile | Vinyl >

```js
crawfish({s3c}).vfileStream('/prefix/**/*.jpg').pipe(destination())
```

### Async Iterator

```js
for await (const vf of crawfish({s3c}).iter({body:true, using: asVfile}, 's3://Bucket/path/*.jpg' )){
  console.log({vf})
}
```

### Promise<Arrray<Vfile | Vinyl>>

```js
const allJpgs = await crawfish({s3c}).vinylArray('s3://Bucket/path/*.jpg')
```

## API Reference 

1. [crawler (s3c, body, maxkeys, ...filters) : crawfishcloud](#crawler)
1. Base Functions
    1. [iter (i:{body, using, NextContinuationToken}, ...filters) : AsyncGenerator](#iter)
    1. [stream (i:{body, using}, ...filters) : Readable](#stream)
    1. [all (i:{body, using}, ...filters) : Promise<T[]>](#all)
1. Readable Node Stream Family
    1. [vfileStream ( ...filters) : Readable](#vfileStream)
    1. [vinylStream (...filters) : Readable](#vinylStream)
    1. [s3Stream (...filters) : Readable](#s3Stream)
1. AsynGenerator Family
    1. [vfileIter ( ...filters) : AsyncGenerator](#vfileIter)
    1. [vinylIter (...filters) : AsyncGenerator](#vinylIter)
    1. [s3Iter (...filters) : AsyncGenerator](#s3Iter)
1. Array Family
    1. [vfileArray ( ...filters) : Promise<VFile[]>](#vfileArray)
    1. [vinylArray (...filters) : Promise<Vinyl[]>](#vinylArray)
    1. [s3Array ( ...filters) : Promise<S3Item[]>](#s3Array)

### crawler()

> `function` default export "aka: crawler"

- `params`

  - s3c: : `S3`
  - body: : `boolean`
  - maxkeys: : `number`
  - ...filters: `string[]`

- `returns`
  - `crawfishcloud`


### > *Base Returns* 
### **iter()**

> `function` returns an `AsyncGenerator<T>`

-  `params`

    - body : `boolean`
    - using : `UsingFunc: (i:S3Item)=><T>`
    - NextContinuationToken? : `string | undefined`
    - ...filters: string[]

-  `returns`

    - AsyncGenerator with elements of type<T> where `T` is the 

### **stream()**

> get a Readable Node Stream

- `params`

  - body : `boolean`
  - using : `UsingFunc: (i:S3Item)=><T>`
  - ...filters: string[]

- `returns`

  - Readable


### **all()**

> `function` returns a `Readable` stream

-  `params`

    - body : `boolean`
    - using : `UsingFunc: (i:S3Item)=><T>`
    - ...filters: string[]

- `returns` 

  - `Promise<T[]>`



### > *Stream Returns* 

### **vfileStream()**

-  `params`

    - ...filters: `string[]`

- `returns`

  - `Readable`

### **vinylStream()**

-  `params`

    - ...filters: `string[]`

- `returns`

    - `Readable`

### **s3Stream()**

-  `params`

    - ...filters: `string[]`

-  `returns`

    - `Readable`


### > *AsyncGenerator Returns* 

### **vfileIter()**

-  `params`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<VFile, void, undefined>


### **vinylIter()**

-  `params`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<Vinyl, void, undefined>


### **s3Iter()**

-  `params`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<S3Item,void, undefined>



### > *Array Returns Promise<T[]>* 

### **vfileArray()**

-  `params`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<Vinyl, void, undefined>

### **vinylArray()**

-  `params`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<Vinyl, void, undefined>

### **s3Array()**

-  `params`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<Vinyl, void, undefined>


#### namesake
`crawfish cloud` because regular crawfish are delightful and they crawl around amongst the buckets - but crawfishcloud crawl in the cloud buckets.
