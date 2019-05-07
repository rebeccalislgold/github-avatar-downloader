var request = require('request');
var secrets = require('./secrets')
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${secrets.GITHUB_TOKEN}`
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
  var obj = JSON.parse(result);

  for (var index in obj) {
    var avatarUrl = obj[index].avatar_url;
    var path = "avatars/" + obj[index].login + ".jpg"
    downloadImageByURL(avatarUrl, path)
  }

});


function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
      //  .on('response', function (response) {
      //    console.log('Downloading image...', 'Response Status Code: ', response.statusCode, "; Response Message: ", response.statusMessage, "; Content Type: ", response.headers['content-type']);
      //  })
      // .on('end', function (response) {
      //   console.log('Download complete!')})
      .pipe(fs.createWriteStream(filePath));

}

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")





