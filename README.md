gulp-pako
=========
A [Gulp](https://github.com/gulpjs/gulp) plugin for [Pako](https://github.com/nodeca/pako), a port of the [zlib library](http://zlib.net/manual.html#Advanced) written in pure JavaScript.

## Purpose
This plugin helps create compressed copies of your static assets using the `gzip` or `deflate` formats.  Your web server can then be configured to serve these directly to browsers, avoiding the overhead of on-the-fly compression.

- For Nginx, refer to [ngx_http_gzip_static_module](http://nginx.org/en/docs/http/ngx_http_gzip_static_module.html).
- For Apache, refer to the [MultiViews option](http://httpd.apache.org/docs/current/content-negotiation.html#multiviews).
- For Amazon S3, just upload the compressed files alongside your uncompressed files. Be sure to set the `Content-Type` and `Content-Encoding` headers.

## Install

```bash
$ npm install --save-dev gulp-pako
```

## Example
Given the files `js/app.js` and `css/app.css` this example will produce `js/app.js.gz` and `js/app.css.deflate`.

```javascript
var gulp = require('gulp');
var pako = require('gulp-pako');

gulp.task('gzip', function() {
  gulp.src('./js/*.js')
    .pipe(pako.gzip())
    .pipe(gulp.dest("./js"));
});

gulp.task('deflate', function() {
  gulp.src('./css/*.css')
    .pipe(pako.deflate())
    .pipe(gulp.dest("./css"));
});

gulp.task('default', ['gzip', 'deflate']);
```

## API

```javascript
var pako = require('gulp-pako');
```

### `pako([format], [options])`
Returns a transform Stream which compresses files using the specified format.

##### `format` (String, optional)
The compression format to use. Supported formats are `'gzip'` and `'deflate'`. Defaults to `'gzip'`.

##### `options` (Object, optional)
Options to pass directly to Pako. Refer to the [Pako API](http://nodeca.github.io/pako/#Deflate.new) for more details.

### `pako.gzip([options])`
Same as `pako('gzip', options)`

### `pako.deflate([options])`
Same as `pako('deflate', options)`


## License

The MIT License (MIT)

Copyright (c) 2014 James Wyse <james@jameswyse.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
