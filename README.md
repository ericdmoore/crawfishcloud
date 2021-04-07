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

[![NPM Version][npm-version-shield]][npm-version-url]
[![Pkg Size][size-shield]][size-url]
[![Code Coverage][coveralls-sheild]][coveralls-url]
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
import crawler, {asVfile} from 'crawfishcloud'
import {S3, SharedIniFileCredentials} from 'aws-sdk'

const creds = new SharedCredentials({profile: 'default'})
const crawfish = crawler({s3:new S3({creds})})

```

## Usage

##### Async Generator

```js
for await (const vf of crawfish({s3c}).vfileIter('s3://Bucket/path/*.jpg')){
  console.log({vf})
}
```

##### Promise<Arrray<Vfile | Vinyl>>

```js
const allJpgs = await crawfish({s3c}).vinylArray('s3://Bucket/path/*.jpg')
```

##### Stream< Vfile | Vinyl >

```js
crawfish({s3c}).vfileStream('/prefix/**/*.jpg').pipe(destination())
```

## Why use Crawfishcloud?

## Features

## Related


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
    
    ```js
    const mdStream = crawler({s3c})
                    .stream({ using: asVinyl },
                            's3://Bucket/pref/**/*.md')
    mdStream.pipe(gulp.dest('/public'))
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



### > *Streams* 

### **[vfileStream()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vfilestream)**

> a stream of [vfile](https://github.com/vfile/vfile)s

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns`

  - `Readable`

### **[vinylStream()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vinylstream)**

> a stream of [vinyl](https://github.com/gulpjs/vinyl)s

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

- `returns`

    - `Readable`

### **[s3Stream()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#s3stream)**

> a stream of S3 Items where S3 list object keys are mixed in with the the getObject keys - called an `S3Item`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `Readable`


### > *AsyncGenerators* 

### **[vfileIter()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vfileiter)**

> get an AyncGenerator thats is ready to run through a set of `VFiles`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<VFile, void, undefined>`


### **[vinylIter()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vinyliter)**

> get an AyncGenerator thats is ready to run through a set of `Vinyls`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<Vinyl, void, undefined>`


### **[s3Iter()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#s3iter)**

> get an AyncGenerator thats is ready to run through a set of `S3Item`

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - `AsyncGenerator<S3Item, void, undefined>`


### > *Promised Arrays* 

### **[vfileArray()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vfilearray)**

> get an array of `vfiles` all loaded into a variable

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<Vfile[]>

### **[vinylArray()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#vinylarray)**

> get an array of `vinyls` all loaded into a variable

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<Vinyl[]>

### **[s3Array()](https://ericdmoore.github.io/crawfishcloud/interfaces/crawfishtypes.crawfishcloudreturnnoproto.html#s3array)**

> get an array of `S3Items` all loaded into a variable

-  `params`

    - ...filters: `string[]` - will overite any configured filters already given to the crawfish - last filters in wins

-  `returns`

    - Promise<S3Item[]>



### > *Exporting Functions*

### **[asVfile()](https://ericdmoore.github.io/crawfishcloud/modules.html#asvfile)**

> turn an S3 object into a vfile

- `params`
    - i : `S3Item`

- `returns`
    - `Vfile`

### **[asVinyl()](https://ericdmoore.github.io/crawfishcloud/modules.html#asvinyl)**

> turn an S3 object into a vinyl

- `params`
    - i : `S3Item`
- `returns`
    - `Vinyl`

### **[asS3()](https://ericdmoore.github.io/crawfishcloud/modules.html#ass3)**

> Just pass the S3 object structure along

- `params`
    - i : `S3Item`
- `returns`
    - `S3Item`



#### namesake
`crawfish cloud` because why not, and because regular crawfish are delightful and they crawl around in a a bucket for a time. So clearly `crawfishcloud` is a crawler of cloud buckets.

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


<!-- 

<ol>crawler</ol>    
        <ul></ul>
        <ul></ul>
        <ul></ul>
    <ol>Base Functions</ol>
        <ul>
            <a href="#iter">
            iter (i:{body, using, NextContinuationToken}, ...filters) => AsyncGenerator</a>
        <ul>
        <ul>
            <a href="#">
            </a>
        </ul>
        <ul>
            <a href="#">
            </a>
        </ul>
    <ol>Readable Node Streams</ol>
        <ul>
            <a href="#">
            </a>
        </ul>
        <ul>
            <a href="#">
            </a>
        </ul>
        <ul>
            <a href="#">
            </a>
        </ul>
    <ol>AsynGenerators</ol>
        <ul>
            <a href="#">
            </a>
        </ul>
        <ul>
            <a href="#">
            </a>
        </ul>
        <ul>
            <a href="#">
            </a>
        </ul>   
    <ol>PromisedArrays</ol>
        <ul>
            <a href="#">
            </a>
        </ul>
        <ul>
            <a href="#">
            </a>
        </ul>
        <ul>
            <a href="#">
            </a>
        </ul>   

-->