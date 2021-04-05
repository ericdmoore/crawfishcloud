/**
 * in: [`s3://Bucket/path/prefx1/**\/*.ext`, `s3://Bucket/path/prefix2/**\/*.ext`,] => 
 * out: {Bucket, prefix: '/path/prefx1/', suffix: '**\/*.ext' }, {Bucket, prefix: '/path/prefx2/', suffix: '**\/*.ext' }
 */