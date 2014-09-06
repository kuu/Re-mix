module.exports = function(match) {
  match('',                      'home#index');
  match('projects',              'projects#index');
  match('projects/:owner/:name', 'projects#show');
  match('users'       ,       'users#index');
  match('users/:login',       'users#show');
};
