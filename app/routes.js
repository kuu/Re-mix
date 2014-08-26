module.exports = function(match) {
  match('',                      'home#index');
  match('projects',              'projects#index');
  match('projects/:owner',       'projects#list');
  match('projects/:owner/:name', 'projects#show');
};
