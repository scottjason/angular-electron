'use strict';

angular.module('app')
  .service('StateService', StateService);

function StateService() {

  var data = {
    'Request': {
      'id': '',
      'createdAt': '',
      'items': [],
      'customers': [],
      'name': ''
    }
  };

  return {
    data: data
  }
}
