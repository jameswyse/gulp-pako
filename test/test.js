var should = require('should');
var pako   = require('../lib');
var gulp   = require('gulp');
var zlib   = require('zlib');
var es     = require('event-stream');
var fs     = require('fs');
var exec   = require('child_process').exec;

require('mocha');

exec('mkdir -p outputs');

function clean(callback) {
  exec('rm -rf outputs/*', callback);
}

describe('gulp-pako', function() {

  describe('Compressing to gzip', function() {
    afterEach(clean);

    it('should append .gz to the file extension', function(done) {
      gulp.src('inputs/*.txt')
        .pipe(pako.gzip())
        .pipe(es.map(function(file, callback) {
          should(file.path).endWith('.gz');
          callback(null, null);
          done();
        }));
    });

    it('should return a Buffer', function(done) {
      gulp.src('inputs/*.txt', { buffer: true })
        .pipe(pako.gzip())
        .pipe(es.map(function(file, callback) {
          should(file.contents).instanceOf(Buffer);
          should(file.isBuffer()).equal(true);
          callback(null, null);
          done();
        }));
    });

    it('should not allow Streams', function(done) {
      gulp.src('inputs/*.txt', { buffer: false })
        .pipe(pako.gzip())
        .on('error', function(err) {
          err.should.be.instanceOf(Error);
          done();
        });
    });

    it('should create a valid file', function(done) {
      var writer = gulp.dest('./outputs');

      writer.on('end', function() {
        fs.readFile('./outputs/one.txt.gz', function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          contents.should.not.be.empty;
          done();
        });
      });

      gulp.src('inputs/*.txt')
        .pipe(pako.gzip())
        .pipe(writer);
    });

    it('should decompress correctly', function(done) {
      var writer = gulp.dest('./outputs');

      writer.on('end', function() {
        fs.readFile('./outputs/one.txt.gz', function(err, contents) {
          zlib.gunzip(contents, function(err, buf) {
            var result = buf.toString('utf8', 0, buf.length);
            fs.readFile('./inputs/one.txt', { encoding: 'utf8' }, function(err, original) {
              should.not.exist(err);
              original.should.equal(result);
              done();
            });
          });
        });
      });

      gulp.src('inputs/*.txt')
        .pipe(pako.gzip())
        .pipe(writer);
    });
  });

  describe('Compressing to deflate', function() {
    afterEach(clean);

    it('should append .deflate to the file extension', function(done) {
      gulp.src('inputs/*.txt')
        .pipe(pako.deflate())
        .pipe(es.map(function(file, callback) {
          should(file.path).endWith('.deflate');
          callback(null, null);
          done();
        }));
    });

    it('should return a Buffer', function(done) {
      gulp.src('inputs/*.txt', { buffer: true })
        .pipe(pako.deflate())
        .pipe(es.map(function(file, callback) {
          should(file.contents).instanceOf(Buffer);
          should(file.isBuffer()).equal(true);
          callback(null, null);
          done();
        }));
    });

    it('should not allow Streams', function(done) {
      gulp.src('inputs/*.txt', { buffer: false })
        .pipe(pako.deflate())
        .on('error', function(err) {
          err.should.be.instanceOf(Error);
          done();
        });
    });

    it('should create a valid file', function(done) {
      var writer = gulp.dest('./outputs');

      writer.on('end', function() {
        fs.readFile('./outputs/one.txt.deflate', function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          contents.should.not.be.empty;
          done();
        });
      });

      gulp.src('inputs/*.txt')
        .pipe(pako.deflate())
        .pipe(writer);
    });

    it('should decompress correctly', function(done) {
      var writer = gulp.dest('./outputs');

      writer.on('end', function() {
        fs.readFile('./outputs/one.txt.deflate', function(err, contents) {
          zlib.inflate(contents, function(err, buf) {
            var result = buf.toString('utf8', 0, buf.length);
            fs.readFile('./inputs/one.txt', { encoding: 'utf8' }, function(err, original) {
              should.not.exist(err);
              original.should.equal(result);
              done();
            });
          });
        });
      });

      gulp.src('inputs/*.txt')
        .pipe(pako.deflate())
        .pipe(writer);
    });
  });
});
