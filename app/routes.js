module.exports = function(match) {
  match('',                     'home#index');
  match('projects',             'projects#index');
  match('projects/:owner/:id',  'projects#show');
  match('users'       ,         'users#index');
  match('users/:id',            'users#show');
};
