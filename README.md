# crawfishcloud

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Contributors][contributors-shield]][contributors-url]
-->

[![GH CI][github-action-(build/test)-shield]][github-action-(build/test)-url]
[![codecov][code-test-coverage-shield]][code-test-coverage-url]

[![NPM Version][npm-version-shield]][npm-version-url]
[![Pkg Size][size-shield]][size-url]
[![MIT License][license-shield]][license-url]

[![Github Activity][gh-commit-activity-shield]][gh-commit-activity-url]
[![Issues Closed ][github-issues-closed-shield]][github-issues-closed-url]
[![Issues][issues-shield]][issues-url]

<!-- [![Built By][ftb-by-devs-shield]][federalies-url] -->
<!-- [![Winter Is Coming][ftb-winter-shield]][ftb-winter-url] -->
<!-- [![Built With][ftb-builtWith-shield]][federalies-url] -->

> A Streaming S3 Bucket Glob Crawler

![Deep Learning AI Generated Psychadelic Style Transfer Art of Crawfish painted with sunset clouds][project-pic]

## Install

[`npm i crawfishcloud -S`](//npm.im/crawfishcloud)

## Setup

```js
// import or require
import {crawler, asVfile} from 'crawfishcloud'

// Setiup AWS-S3 with your credentials
import {S3, SharedIniFileCredentials} from 'aws-sdk'
const credentials = new SharedIniFileCredentials({profile: 'default'})

// crawfish uses your configured S3 Client to get data from S3
const crawfish = crawler({s3c: new S3({credentials})})

```

## Usage

##### Async Generator

```js
for await (const vf of crawler({s3c}).vfileIter('s3://Bucket/path/*.jpg')){
  console.log({vf})
}
```

##### Promise<Arrray<Vfile | Vinyl>>

```js
const allJpgs = await crawler({s3c}).vinylArray('s3://Bucket/path/*.jpg')
```

##### Stream< Vfile | Vinyl >

```js
crawler({s3c}).vfileStream('/prefix/**/*.jpg').pipe(destination())
```

## Why use crawfishcloud?

Ever had a set of files in S3 and you are thinking "Why can't I use a glob pattern like I would in a unix command, or in gulp, and pull all of those files out together?"

Now you can.

## Features

`crawfishcloud` supports 3 different processing patterns to handle data from your buckets.

- Promised Arrays
    - While this structure is admittedly the most straight forward, it can also blow through your RAM because collapsing an S3 stream to one array can often take more space than is commericial available for RAM. Sure, maybe you are thinking "I know my data, and I just need the 5 files loaded together from this s3 prefix, and I know it will fit" - then the `array pattern` is just the ticket.
- Node Streams
    - Node Streams are incredible if you are familiar with them. The `.stream()` pattern allows you to stream out a set of obejcts to your down stream processing.
- AsyncGenerators
    - For many people, although Async Generators are a newer addition to the language, it will strike a sweet spot of "ease of use" and still being able to process terribly large amounts of data. since its pulled from the network on demand.
- Uses Modern Syntax
- async/ await
- All in about 230 lines of js code (crawfish + utils + builtin-exporters)

## Inspired By

- [s3-glob](https://github.com/izaakschroeder/s3-glob)
- [node-s3glob](https://github.com/RallySoftware/node-s3glob)

## License

MIT Eric D Moore MIT 

## API Reference 

<details>
    <summary>Table Of Contents</summary>

- [crawler (s3c, body, maxkeys, ...filters) : crawfishcloud](#crawler)
- Base Functions
    - [iter (i:{body, using, NextContinuationToken}, ...filters) : AsyncGenerator](#iter)
    - [stream (i:{body, using}, ...filters) : Readable](#stream)
    - [all (i:{body, using}, ...filters) : Promise<T[]>](#all)
- Readable Node Streams
    - [vfileStream ( ...filters) : Readable](#vfileStream)
    - [vinylStream (...filters) : Readable](#vinylStream)
    - [s3Stream (...filters) : Readable](#s3Stream)
- AsynGenerators
    - [vfileIter ( ...filters) : AsyncGenerator](#vfileIter)
    - [vinylIter (...filters) : AsyncGenerator](#vinylIter)
    - [s3Iter (...filters) : AsyncGenerator](#s3Iter)
- Promised Arrays
    - [vfileArray ( ...filters) : Promise<VFile[]>](#vfileArray)
    - [vinylArray (...filters) : Promise<Vinyl[]>](#vinylArray)
    - [s3Array ( ...filters) : Promise<S3Item[]>](#s3Array)
- Exporting Functions
    - [asVfile (i:S3Item) => Vfile](#asVfile)
    - [asVinyl (i:S3Item) => Vinyl](#asVinyl)
    - [asS3 (i:S3Item) => S3Item](#asS3)

</details>

### [crawler()](https://ericdmoore.github.io/crawfishcloud/modules.html#crawler)

> the default export function "aka: crawler"

- `params`

  - s3c: : `S3`
  - body: : `boolean`
  - maxkeys: : `number`
  - ...filters: `string[]`

- `returns`
  - `crawfishcloud`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})

    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    const arr = await crab.all({body:true, using: asVfile})
    ```
    </details>
<br/>

### > *Base Returns* 
### **[iter()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#iter)**

> get an `AsyncGenerator<T>` ready to use with a `for await (){}` loop where each elemement is of Type<T> based on the Using Function

-  `params`

    - body : `boolean`
    - using : `UsingFunc: (i:S3Item)=><T>`
    - NextContinuationToken? : `string | undefined`
    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - AsyncGenerator with elements of type<T> where `T` is the 

- <details>
    <summary>example</summary>
    
   ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    for await (const vf of crab.iter({body:true, using: asVfile}) ){
        console.log(vf)
    }
    ```
    </details>
<br/>

### **[stream()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#stream)**

> get a Readable Node Stream ready to pipe to a transform or writable stream

- `params`

  - body : `boolean`
  - using : `UsingFunc: (i:S3Item)=><T>`
  - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins
  
- `returns`

  - Readable

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    crab.stream({body:true, using: asVfile})
        .pipe(rehypePipe())
        .pipe(destinationFolder())
     ```
    </details>
<br/>

### **[all()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#all)**

> load all of the s3 url into an array. Where the array is resolved when all of the elements are populated to the array.

-  `params`

    - body : `boolean`
    - using : `UsingFunc: (i:S3Item)=><T>`
    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns` 

  - `Promise<T[]>`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})

    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    const arr = await crab.all({body:true, using: asVfile})
     ```
    </details>
<br/>

### **[reduce()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#reduce)**

> Reduce the files represented in the glob into a new Type. The process batches sets of 1000 elements into memory and reduces.

-  `params`

    - init : `<OutputType>` - starting value for reducer
    - using : `UsingFunc: (i:S3Item)=><ElementType>`
    - reducer : `(prior:OutputType, current:ElementType, i:number)=>OutputType`
    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns` 

  - `Promise<OutputType>`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})

    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    const count = await crab.reduce(0, using: asS3, reducer:(p)=>p+1)
     ```
    </details>
<br/>


### > *Streams* 

### **[vfileStream()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vfilestream)**

> a stream of [vfile](https://github.com/vfile/vfile)s

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns`

  - `Readable`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c})
    crab.vfileStream('s3://ericdmoore.com-images/*.jpg')
        .pipe(jpgOptim())
        .pipe(destinationFolder())
     ```
    </details>
<br/>

### **[vinylStream()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vinylstream)**

> a stream of [vinyl](https://github.com/gulpjs/vinyl)s

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns`

    - `Readable`

- <details>
    <summary>example</summary>
    
   ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c})
    crab.vinylStream('s3://ericdmoore.com-images/*.jpg')
        .pipe(jpgOptim())
        .pipe(destinationFolder())
     ```
    </details>
<br/>

### **[s3Stream()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#s3stream)**

> a stream of S3 Items where S3 list object keys are mixed in with the the getObject keys - called an `S3Item`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `Readable`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c})
    crab.s3Stream('s3://ericdmoore.com-images/*.jpg')
        .pipe(S3ImageOptim())
        .pipe(destinationFolder())
     ```
    </details>
<br/>


### > *AsyncGenerators* 

### **[vfileIter()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vfileiter)**

> get an AyncGenerator thats is ready to run through a set of `VFiles`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<VFile, void, undefined>`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c})
    for await (const vf of crab.vfileIter('s3://ericdmoore.com-images/*.jpg') ){
        console.log(vf)
    }    
    ```
    </details>
<br/>

### **[vinylIter()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vinyliter)**

> get an AyncGenerator thats is ready to run through a set of `Vinyls`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<Vinyl, void, undefined>`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c})
    for await (const v of crab.vinylIter('s3://ericdmoore.com-images/*.jpg') ){
        console.log(vf)
    }    
     ```
    </details>
<br/>

### **[s3Iter()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#s3iter)**

> get an AyncGenerator thats is ready to run through a set of `S3Item`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<S3Item, void, undefined>`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c})
    for await (const s3i of crab.s3Iter('s3://ericdmoore.com-images/*.jpg') ){
        console.log(s3i)
    }
    ```
    </details>
<br/>

### > *Promised Arrays* 

### **[vfileArray()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vfilearray)**

> get an array of `vfiles` all loaded into a variable

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<Vfile[]>

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})

    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    const vfArr = await crab.vfileArray()
     ```
    </details>
<br/>

### **[vinylArray()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vinylarray)**

> get an array of `vinyls` all loaded into a variable

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<Vinyl[]>

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})

    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    const vArr = await crab.vinylArray()
     ```
    </details>
<br/>

### **[s3Array()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#s3array)**

> get an array of `S3Items` all loaded into a variable

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<S3Item[]>

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})

    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    const arr = await crab.s3Array()
     ```
    </details>
<br/>


### > *Exporting Functions*

### **[asVfile()](https://ericdmoore.github.io/crawfishcloud/modules.html#asvfile)**

> turn an S3 object into a vfile

- `params`
    - s3i : `S3Item`
    - i : `number`

- `returns`
    - `Vfile`

- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVfile} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    for await (const vf of crab.iter({body:true, using: asVfile}) ){
        console.log(vf)
    }
    ```
    </details>
<br/>

### **[asVinyl()](https://ericdmoore.github.io/crawfishcloud/modules.html#asvinyl)**

> turn an S3 object into a vinyl

- `params`
    - s3i : `S3Item`
    - i : `number`
- `returns`
    - `Vinyl`
- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asVinyl} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    for await (const vf of crab.iter({body:true, using: asVinyl}) ){
        console.log(vf)
    }
    ```
    </details>
<br/>

### **[asS3()](https://ericdmoore.github.io/crawfishcloud/modules.html#ass3)**

> Just pass the S3 object structure along

- `params`
    - s3i : `S3Item`
    - i : `number`
- `returns`
    - `S3Item`
- <details>
    <summary>example</summary>
    
    ```ts
    import {crawler, asS3} from 'crawfishcloud'
    import {S3, SharedIniFileCredentials} from 'aws-sdk'
    const credentials = new SharedIniFileCredentials({profile:'default'})
    const s3c = new S3({credentials, region:'us-west-2'})
    
    const crab = crawler({s3c}, 's3://ericdmoore.com-images/*.jpg')
    for await (const vf of crab.iter({body:true, using: asS3}) ){
        console.log(vf)
    }
    ```
    </details>
<br/>


#### namesake
`crawfish cloud` because why not, and because regular crawfish are delightful and they crawl around in a a bucket for a time. So clearly `crawfishcloud` is a crawler of cloud buckets.

Logo credit: deepart.io

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/ericdmoore/crawfishcloud?style=for-the-badge
[contributors-url]: https://github.com/ericdmoore/crawfishcloud/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/ericdmoore/crawfishcloud?style=for-the-badge
[forks-url]: https://github.com/ericdmoore/crawfishcloud/network/members

[size-shield]: https://img.shields.io/bundlephobia/minzip/crawfishcloud?style=for-the-badge
[size-url]: https://bundlephobia.com/result?p=crawfishcloud

[stars-shield]: https://img.shields.io/github/stars/ericdmoore/crawfishcloud?style=for-the-badge
[stars-url]: https://github.com/ericdmoore/crawfishcloud/stargazers

[issues-shield]: https://img.shields.io/github/issues/ericdmoore/crawfishcloud?style=for-the-badge
[issues-url]: https://github.com/ericdmoore/crawfishcloud/issues

[license-shield]: https://img.shields.io/github/license/ericdmoore/crawfishcloud?style=for-the-badge
[license-url]: https://github.com/ericdmoore/crawfishcloud/blob/master/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-url]: https://linkedin.com/in/eric.moore
[project-pic]: https://raw.githubusercontent.com/ericdmoore/crawfishcloud/main/imgs/deepart2.jpg

[ftb-winter-shield]: https://forthebadge.com/images/badges/winter-is-coming.svg
[ftb-winter-url]: https://github.com/federalies/dynamoco/wiki#winter-is-coming

[ftb-builtwith-shield]: https://forthebadge.com/images/badges/built-with-love.svg
[ftb-by-devs-shield]: https://forthebadge.com/images/badges/built-by-developers.svg

[code-test-coverage-shield]:https://codecov.io/gh/ericdmoore/crawfishcloud/branch/main/graph/badge.svg?token=HG4ZLG6E7H
[code-test-coverage-url]:https://codecov.io/gh/ericdmoore/crawfishcloud

[coveralls-sheild]:https://img.shields.io/coveralls/github/ericdmoore/crawfishcloud?style=for-the-badge
[coveralls-url]:https://coveralls.io/github/ericdmoore/crawfishcloud

[npm-version-url]:https://www.npmjs.com/package/crawfishcloud
[npm-version-shield]:https://img.shields.io/npm/v/crawfishcloud?style=for-the-badge

[github-action-(build/test)-url]:https://github.com/ericdmoore/crawfishcloud/actions/workflows/node.js.yml
[github-action-(build/test)-shield]:https://github.com/ericdmoore/crawfishcloud/actions/workflows/node.js.yml/badge.svg

[github-issues-closed-url]:https://github.com/ericdmoore/crawfishcloud/issues?q=is%3Aissue+is%3Aclosed+
[github-issues-closed-shield]:https://img.shields.io/github/issues-closed-raw/ericdmoore/crawfishcloud?style=for-the-badge

[gh-commit-activity-url]:https://github.com/ericdmoore/crawfishcloud/pulse/monthly
[gh-commit-activity-shield]:https://img.shields.io/github/commit-activity/m/ericdmoore/crawfishcloud?style=for-the-badge

