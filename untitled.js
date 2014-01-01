/*
 * Inspired by: http://stackoverflow.com/questions/4360060/video-streaming-with-html-5-via-node-js
 */

var http = require('http'),
    fs = require('fs'),
    util = require('util'),
    url = require('url');

http.createServer(function (req, res) {

  var parts = url.parse(req.url, true);
  var query = parts.query;
  console.log('QUERY:');
  console.log(query);
  if (query.key!='mye') {
    res.writeHeader(200, {"Content-Type": "text/plain"});
    res.write("Can not load video stream, Wrong key!");
    res.end();
  } else {
    if (query.video=='fiesta') {
      var path = '/mnt/passport/NAS/Personal/Wedding/FiestaFull_usb.mp4';
    } else if (query.video=='misa') {
      var path = '/mnt/passport/NAS/Personal/Wedding/MisaLive_usb.mp4';
    } else if (query.video=='short') {
      var path = '/mnt/passport/NAS/Personal/Wedding/ShortFilm-Boda_usb.mp4';
    } else {
      var path = '/mnt/passport/NAS/Personal/Wedding/Trailer_usb.mp4';
    }
      var stat = fs.statSync(path);
      var total = stat.size;
      if (req.headers['range']) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

        var file = fs.createReadStream(path, {start: start, end: end});
        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
        file.pipe(res);
      } else {
        console.log('ALL: ' + total);
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
        fs.createReadStream(path).pipe(res);
      }
  }
}).listen(1337, '192.168.0.21');
console.log('Server running at http://192.168.0.21:1337/');