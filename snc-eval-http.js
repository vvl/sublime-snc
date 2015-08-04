#!/usr/bin/env node

var querystring = require('querystring');
var http = require('https');
var fs = require('fs');

function PostCode(codestring) {
  // Build the post string from an object
  var post_data = querystring.stringify({
    'script' : codestring
  });
  
  var username = 'jasmine-snc';
  var password = 'jasmine-snc';

  // An object of options to indicate where to post to
  var post_options = {
    hostname: 'demo022.service-now.com',
    path: '/eval.do',
    port: 443,
    method: 'POST',
    auth: username + ":" + password,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
    if (res.statusCode != 200) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers)); 
      return;
    }
    
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log(chunk);
    });
  });
  
  post_req.on('error', function(error) {
    console.log(error.toString());
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
}


console.log("snc-eval - run Javascript code in a ServiceNow backend");
if (process.argv.length < 3) {
  console.log("no input file is specified -> exiting");
  process.exit(-1);
}

fs.readFile(process.argv[2], 'utf-8', function(err, data) {
  if (err) {
    console.log("FATAL An error occurred trying to read in the file: " + err);
    process.exit(-2);
  }
  if (data) {
    PostCode(data);
  }
  else {
    console.log("the input file is empty -> existing");
    process.exit(0);
  }
});
