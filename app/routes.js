module.exports = function(match) {
  match('',                      'home#index');
  match('projects',              'projects#index');
  match('projects/:user',       'projects#list');
  match('projects/:user/:project', 'projects#show');
};
