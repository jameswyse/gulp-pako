var PLUGIN_NAME = 'gulp-pako';

var through     = require('through2');
var pako        = require('pako');
var PluginError = require('gulp-util').PluginError;

var extensions  = {
  'gzip': '.gz',
  'deflate': '.deflate'
};

function compress(format, options) {

  // Check argument order
  if(typeof format === 'Object') {
    options = format;
    format = 'gzip';
  }

  // Set Defaults
  options = options || {};
  format  = format  || 'gzip';

  // Check for invalid formats
  if(!extensions[format]) {
    throw new PluginError(PLUGIN_NAME, 'Invalid format: only gzip and deflate are supported.');
  }

  // Ensure gzip wrapper is created when using the gzip format
  options.gzip = format === 'gzip';

  // Return a through Stream to receive files
  return through.obj(function(file, enc, callback) {
    var self = this;

    // File is empty - pass it on.
    if (file.isNull()) {
      self.push(file);
      return callback();
    }

    // File is a Stream - Emit an error
    if (file.isStream()) {
      self.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not currently supported.'));
      return callback();
    }

    // File is a Buffer - Compress it
    if (file.isBuffer()) {
      var newFile = file.clone();

      newFile.path = file.path + extensions[format];
      newFile.contents = new Buffer(pako[format](file.contents, options));

      self.push(newFile);
      return callback();
    }
  });
}

module.exports = compress;

module.exports.gzip = function(options) {
  return compress('gzip', options);
};

module.exports.deflate = function(options) {
  return compress('deflate', options);
};
