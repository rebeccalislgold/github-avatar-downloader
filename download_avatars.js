var request = require('request');
var secrets = require('./secrets');
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

var repo_Name = process.argv[2];
var repo_Owner = process.argv[3];

getRepoContributors(repo_Owner, repo_Name, function(err, result) {

  if(repo_Name && repo_Owner) {
    console.log("Errors:", err);
    var obj = JSON.parse(result);

    for (var index in obj) {
      var avatarUrl = obj[index].avatar_url;
      var path = "avatars/" + obj[index].login + ".jpg";
      downloadImageByURL(avatarUrl, path);
    }

  } else {
    console.log("Please enter a repository name and owner.");
  }
});


function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
      .pipe(fs.createWriteStream(filePath));
}




