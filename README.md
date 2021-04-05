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

1. [iter(input:{body, using, NextContinuationToken}, ...filters: string[]) : AsyncGenerator](#)
1. [stream(input:{body, using}, ...filters: string[]) : Readable](#)
1. [all(input:{body, using}, ...filters: string[]) : Promise<T[]>](#)
1. [vfileStream( ...filters: string[]) : Readable](#)
1. [vinylStream(...filters: string[]) : Readable](#)
1. [s3Stream(...filters: string[]) : Readable](#)
1. [vfileIter( ...filters: string[]): AsyncGenerator](#)
1. [vinylIter(...filters: string[]): AsyncGenerator](#)
1. [s3Iter(...filters: string[]): AsyncGenerator](#)
1. [vfileArray( ...filters: string[]): Promise<VFile[]>](#)
1. [vinylArray(...filters: string[]): Promise<Vinyl[]>](#)
1. [s3Array( ...filters: string[]): Promise<S3Item[]>](#)

### crawler()

> `function` default export "aka: crawler"

- `Parameters`

  - s3c: : `S3`
  - body: : `boolean`
  - maxkeys: : `number`
  - ...filters: `string[]`

- `returns`
  - `crawfishcloud`


### > *Base Returns* 
### **iter()**

> `function` returns an `AsyncGenerator<T>`

-  `Parameters`

    - body : `boolean`
    - using : `UsingFunc: (i:S3Item)=><T>`
    - NextContinuationToken? : `string | undefined`
    - ...filters: string[]

-  `returns`

    - AsyncGenerator with elements of type<T> where `T` is the 

### **stream()**

> get a Readable Node Stream

- `Parameters`

  - body : `boolean`
  - using : `UsingFunc: (i:S3Item)=><T>`
  - ...filters: string[]

- `returns`

  - Readable


### **all()**

> `function` returns a `Readable` stream

-  `Parameters`

    - body : `boolean`
    - using : `UsingFunc: (i:S3Item)=><T>`
    - ...filters: string[]

- `returns` 

  - `Promise<T[]>`



### > *Stream Returns* 

### **vfileStream()**

-  `Parameters`

    - ...filters: `string[]`

- `returns`

  - `Readable`

### **vinylStream()**

-  `Parameters`

    - ...filters: `string[]`

- `returns`

    - `Readable`

### **s3Stream()**

-  `Parameters`

    - ...filters: `string[]`

-  `returns`

    - `Readable`


### > *AsyncGenerator Returns* 

### **vfileIter()**

-  `Parameters`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<VFile, void, undefined>


### **vinylIter()**

-  `Parameters`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<Vinyl, void, undefined>


### **s3Iter()**

-  `Parameters`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<S3Item,void, undefined>



### > *Array Returns Promise<T[]>* 

### **vfileArray()**

-  `Parameters`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<Vinyl, void, undefined>

### **vinylArray()**

-  `Parameters`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<Vinyl, void, undefined>

### **s3Array()**

-  `Parameters`

    - ...filters: `string[]`

-  `returns`

    - AsyncGenerator<Vinyl, void, undefined>


#### namesake
`crawfish cloud` because regular crawfish are delightful and they crawl around amongst the buckets - but crawfishcloud crawl in the cloud buckets.
