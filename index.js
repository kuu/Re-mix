var express = require('express')
  , rendr = require('rendr')
  , config = require('config')
  , app = express();

/**
 * Initialize Express middleware stack.
 */
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.use(express.logger());
app.use(express.bodyParser());

app.get('/api/:user/projects', function(req,res){
  //var s = 'Hey! user=' + req.params.user + ' death!';
  res.json([
  {
    "id": 1,
    "name": "grit",
    "full_name": "mojombo/grit",
    "owner": {
      "login": "mojombo",
      "id": 1,
      "avatar_url": "https://avatars.githubusercontent.com/u/1?v=2",
      "gravatar_id": "25c7c18223fb42a4c6ae1c8db6f50f9b",
      "url": "https://api.github.com/users/mojombo",
      "html_url": "https://github.com/mojombo",
      "followers_url": "https://api.github.com/users/mojombo/followers",
      "following_url": "https://api.github.com/users/mojombo/following{/other_user}",
      "gists_url": "https://api.github.com/users/mojombo/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/mojombo/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/mojombo/subscriptions",
      "organizations_url": "https://api.github.com/users/mojombo/orgs",
      "repos_url": "https://api.github.com/users/mojombo/repos",
      "events_url": "https://api.github.com/users/mojombo/events{/privacy}",
      "received_events_url": "https://api.github.com/users/mojombo/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/mojombo/grit",
    "description": "**Grit is no longer maintained. Check out libgit2/rugged.** Grit gives you object oriented read/write access to Git repositories via Ruby.",
    "fork": false,
    "url": "https://api.github.com/repos/mojombo/grit",
    "forks_url": "https://api.github.com/repos/mojombo/grit/forks",
    "keys_url": "https://api.github.com/repos/mojombo/grit/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/mojombo/grit/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/mojombo/grit/teams",
    "hooks_url": "https://api.github.com/repos/mojombo/grit/hooks",
    "issue_events_url": "https://api.github.com/repos/mojombo/grit/issues/events{/number}",
    "events_url": "https://api.github.com/repos/mojombo/grit/events",
    "assignees_url": "https://api.github.com/repos/mojombo/grit/assignees{/user}",
    "branches_url": "https://api.github.com/repos/mojombo/grit/branches{/branch}",
    "tags_url": "https://api.github.com/repos/mojombo/grit/tags",
    "blobs_url": "https://api.github.com/repos/mojombo/grit/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/mojombo/grit/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/mojombo/grit/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/mojombo/grit/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/mojombo/grit/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/mojombo/grit/languages",
    "stargazers_url": "https://api.github.com/repos/mojombo/grit/stargazers",
    "contributors_url": "https://api.github.com/repos/mojombo/grit/contributors",
    "subscribers_url": "https://api.github.com/repos/mojombo/grit/subscribers",
    "subscription_url": "https://api.github.com/repos/mojombo/grit/subscription",
    "commits_url": "https://api.github.com/repos/mojombo/grit/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/mojombo/grit/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/mojombo/grit/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/mojombo/grit/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/mojombo/grit/contents/{+path}",
    "compare_url": "https://api.github.com/repos/mojombo/grit/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/mojombo/grit/merges",
    "archive_url": "https://api.github.com/repos/mojombo/grit/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/mojombo/grit/downloads",
    "issues_url": "https://api.github.com/repos/mojombo/grit/issues{/number}",
    "pulls_url": "https://api.github.com/repos/mojombo/grit/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/mojombo/grit/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/mojombo/grit/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/mojombo/grit/labels{/name}",
    "releases_url": "https://api.github.com/repos/mojombo/grit/releases{/id}"
  },
  {
    "id": 26,
    "name": "merb-core",
    "full_name": "wycats/merb-core",
    "owner": {
      "login": "wycats",
      "id": 4,
      "avatar_url": "https://avatars.githubusercontent.com/u/4?v=2",
      "gravatar_id": "428167a3ec72235ba971162924492609",
      "url": "https://api.github.com/users/wycats",
      "html_url": "https://github.com/wycats",
      "followers_url": "https://api.github.com/users/wycats/followers",
      "following_url": "https://api.github.com/users/wycats/following{/other_user}",
      "gists_url": "https://api.github.com/users/wycats/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/wycats/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/wycats/subscriptions",
      "organizations_url": "https://api.github.com/users/wycats/orgs",
      "repos_url": "https://api.github.com/users/wycats/repos",
      "events_url": "https://api.github.com/users/wycats/events{/privacy}",
      "received_events_url": "https://api.github.com/users/wycats/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/wycats/merb-core",
    "description": "Merb Core: All you need. None you don't.",
    "fork": false,
    "url": "https://api.github.com/repos/wycats/merb-core",
    "forks_url": "https://api.github.com/repos/wycats/merb-core/forks",
    "keys_url": "https://api.github.com/repos/wycats/merb-core/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/wycats/merb-core/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/wycats/merb-core/teams",
    "hooks_url": "https://api.github.com/repos/wycats/merb-core/hooks",
    "issue_events_url": "https://api.github.com/repos/wycats/merb-core/issues/events{/number}",
    "events_url": "https://api.github.com/repos/wycats/merb-core/events",
    "assignees_url": "https://api.github.com/repos/wycats/merb-core/assignees{/user}",
    "branches_url": "https://api.github.com/repos/wycats/merb-core/branches{/branch}",
    "tags_url": "https://api.github.com/repos/wycats/merb-core/tags",
    "blobs_url": "https://api.github.com/repos/wycats/merb-core/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/wycats/merb-core/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/wycats/merb-core/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/wycats/merb-core/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/wycats/merb-core/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/wycats/merb-core/languages",
    "stargazers_url": "https://api.github.com/repos/wycats/merb-core/stargazers",
    "contributors_url": "https://api.github.com/repos/wycats/merb-core/contributors",
    "subscribers_url": "https://api.github.com/repos/wycats/merb-core/subscribers",
    "subscription_url": "https://api.github.com/repos/wycats/merb-core/subscription",
    "commits_url": "https://api.github.com/repos/wycats/merb-core/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/wycats/merb-core/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/wycats/merb-core/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/wycats/merb-core/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/wycats/merb-core/contents/{+path}",
    "compare_url": "https://api.github.com/repos/wycats/merb-core/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/wycats/merb-core/merges",
    "archive_url": "https://api.github.com/repos/wycats/merb-core/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/wycats/merb-core/downloads",
    "issues_url": "https://api.github.com/repos/wycats/merb-core/issues{/number}",
    "pulls_url": "https://api.github.com/repos/wycats/merb-core/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/wycats/merb-core/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/wycats/merb-core/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/wycats/merb-core/labels{/name}",
    "releases_url": "https://api.github.com/repos/wycats/merb-core/releases{/id}"
  },
  {
    "id": 27,
    "name": "rubinius",
    "full_name": "rubinius/rubinius",
    "owner": {
      "login": "rubinius",
      "id": 317747,
      "avatar_url": "https://avatars.githubusercontent.com/u/317747?v=2",
      "gravatar_id": "8a664b7c5ca834af3e7e49d3a6160082",
      "url": "https://api.github.com/users/rubinius",
      "html_url": "https://github.com/rubinius",
      "followers_url": "https://api.github.com/users/rubinius/followers",
      "following_url": "https://api.github.com/users/rubinius/following{/other_user}",
      "gists_url": "https://api.github.com/users/rubinius/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/rubinius/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/rubinius/subscriptions",
      "organizations_url": "https://api.github.com/users/rubinius/orgs",
      "repos_url": "https://api.github.com/users/rubinius/repos",
      "events_url": "https://api.github.com/users/rubinius/events{/privacy}",
      "received_events_url": "https://api.github.com/users/rubinius/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/rubinius/rubinius",
    "description": "Rubinius, the Ruby Environment",
    "fork": false,
    "url": "https://api.github.com/repos/rubinius/rubinius",
    "forks_url": "https://api.github.com/repos/rubinius/rubinius/forks",
    "keys_url": "https://api.github.com/repos/rubinius/rubinius/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/rubinius/rubinius/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/rubinius/rubinius/teams",
    "hooks_url": "https://api.github.com/repos/rubinius/rubinius/hooks",
    "issue_events_url": "https://api.github.com/repos/rubinius/rubinius/issues/events{/number}",
    "events_url": "https://api.github.com/repos/rubinius/rubinius/events",
    "assignees_url": "https://api.github.com/repos/rubinius/rubinius/assignees{/user}",
    "branches_url": "https://api.github.com/repos/rubinius/rubinius/branches{/branch}",
    "tags_url": "https://api.github.com/repos/rubinius/rubinius/tags",
    "blobs_url": "https://api.github.com/repos/rubinius/rubinius/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/rubinius/rubinius/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/rubinius/rubinius/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/rubinius/rubinius/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/rubinius/rubinius/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/rubinius/rubinius/languages",
    "stargazers_url": "https://api.github.com/repos/rubinius/rubinius/stargazers",
    "contributors_url": "https://api.github.com/repos/rubinius/rubinius/contributors",
    "subscribers_url": "https://api.github.com/repos/rubinius/rubinius/subscribers",
    "subscription_url": "https://api.github.com/repos/rubinius/rubinius/subscription",
    "commits_url": "https://api.github.com/repos/rubinius/rubinius/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/rubinius/rubinius/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/rubinius/rubinius/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/rubinius/rubinius/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/rubinius/rubinius/contents/{+path}",
    "compare_url": "https://api.github.com/repos/rubinius/rubinius/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/rubinius/rubinius/merges",
    "archive_url": "https://api.github.com/repos/rubinius/rubinius/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/rubinius/rubinius/downloads",
    "issues_url": "https://api.github.com/repos/rubinius/rubinius/issues{/number}",
    "pulls_url": "https://api.github.com/repos/rubinius/rubinius/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/rubinius/rubinius/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/rubinius/rubinius/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/rubinius/rubinius/labels{/name}",
    "releases_url": "https://api.github.com/repos/rubinius/rubinius/releases{/id}"
  }
  ]);
});

/**
 * Initialize our Rendr server.
 */
var server = rendr.createServer({
  dataAdapterConfig: config.api,
  appData: config.appData
});

/**
  * To mount Rendr, which owns its own Express instance for better encapsulation,
  * simply add `server` as a middleware onto your Express app.
  * This will add all of the routes defined in your `app/routes.js`.
  * If you want to mount your Rendr app onto a path, you can do something like:
  *
  *     app.use('/my_cool_app', server);
  */
app.use(server);

/**
 * Start the Express server.
 */
function start(){
  var port = process.env.PORT || config.server.port;
  app.listen(port);
  console.log("server pid %s listening on port %s in %s mode",
    process.pid,
    port,
    app.get('env')
  );
}


/**
 * Only start server if this script is executed, not if it's require()'d.
 * This makes it easier to run integration tests on ephemeral ports.
 */
if (require.main === module) {
  start();
}

exports.app = app;
