const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.str = '';
  }

  _transform(chunk, encoding, callback) {
    const newStr = this.str + chunk.toString();
    const strArr = newStr.split(`${os.EOL}`);
    const lastStr = strArr.pop();
    this.str = '';
    strArr.forEach(item => {
        this.push(item);
    });
    if (newStr.endsWith(`${os.EOL}`)) {
        this.push(lastStr);
    } else {
        this.str = lastStr;
    }
    callback();
  }

  _flush(callback) {
    if (this.str) {
      this.push(this.str);
    }
  callback();
  }
}

module.exports = LineSplitStream;
