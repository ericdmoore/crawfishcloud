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
const crawfish = crawler({s3:new S3({creds})})

```

## Usage

### Stream< Vfile | Vinyl >

```js
crawfish({s3c}).vfileStream('/prefix/**/*.jpg').pipe(destination())
```

### Async Iterator

```js
for await (const vf of crawfish({s3c}).iter({using: asVfile}, 's3://Bucket/path/*.jpg')){
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
1. Exporting Functions
    1. [asVfile (i:S3Item) => Vfile](#asVfile)
    1. [asVinyl (i:S3Item) => Vinyl](#asVinyl)
    1. [asS3 (i:S3Item) => S3Item](#asS3)


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

> get an `AsyncGenerator<T>` ready to use with a `for await (){}` loop where each elemement is of Type<T> based on the Using Function

-  `params`

    - body : `boolean`
    - using : `UsingFunc: (i:S3Item)=><T>`
    - NextContinuationToken? : `string | undefined`
    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - AsyncGenerator with elements of type<T> where `T` is the 

### **stream()**

> get a Readable Node Stream ready to pipe to a transform or writable stream

- `params`

  - body : `boolean`
  - using : `UsingFunc: (i:S3Item)=><T>`
  - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins
  
- `returns`

  - Readable


### **all()**

> load all of the s3 url into an array. Where the array is resolved when all of the elements are populated to the array.

-  `params`

    - body : `boolean`
    - using : `UsingFunc: (i:S3Item)=><T>`
    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns` 

  - `Promise<T[]>`



### > *Stream Returns* 

### **vfileStream()**

> a stream of [vfile](https://github.com/vfile/vfile)s

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns`

  - `Readable`

### **vinylStream()**

> a stream of [vinyl](https://github.com/gulpjs/vinyl)s

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns`

    - `Readable`

### **s3Stream()**

> a stream of S3 Items where S3 list object keys are mixed in with the the getObject keys - called an `S3Item`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `Readable`


### > *AsyncGenerator Returns* 

### **vfileIter()**

> get an AyncGenerator thats is ready to run through a set of `VFiles`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<VFile, void, undefined>`


### **vinylIter()**

> get an AyncGenerator thats is ready to run through a set of `Vinyls`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<Vinyl, void, undefined>`


### **s3Iter()**

> get an AyncGenerator thats is ready to run through a set of `S3Item`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<S3Item, void, undefined>`


### > *Array Returns Promise<T[]>* 

### **vfileArray()**

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<Vfile[]>

### **vinylArray()**

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<Vinyl[]>

### **s3Array()**

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<S3Item[]>



### > *Exporting Functions*

### **asVfile()**

> turn an S3 object into a vfile

- `params`
    - i : `S3Item`

- `returns`
    - `Vfile`

### **asVinyl()**

> turn an S3 object into a vinyl

- `params`
    - i : `S3Item`
- `returns`
    - `Vinyl`

### **asS3()**

> Just pass the S3 object structure along

- `params`
    - i : `S3Item`
- `returns`
    - `S3Item`



#### namesake
`crawfish cloud` because regular crawfish are delightful and they crawl around amongst the buckets - but crawfishcloud crawl in the cloud buckets.
