angular.module('bmslink.controllers')

.controller('settingsController',['$scope','$interval','$localStorage','API','common',

    function ($scope,$interval,$localStorage,API,common) {
      
        var resource = 'settings';

        edit = false;

        $scope.user = $localStorage;

        $scope.ready = false;

        $scope.options = {};

        $scope.options['automation (enable)'] = [

            'disabled',
            'enabled'

        ];

        var init = function() {

            var defaults = {

                sort: '-name'
            
            }
       
            if (!$localStorage[resource]) {

                $localStorage[resource] = defaults;

            }

            $localStorage.navbar.update = $localStorage[resource].update;
            
            var cols = $localStorage[resource].columns;

            var data = $localStorage[resource].data;

            if ((cols) && (data)) {

                $scope.columns = cols;

                $scope.data = data;

                $scope.ready = true;

            }

            common.title(resource);

            $localStorage.navbar.route = resource;

            $localStorage.navbar.update = 0;

        };

        $scope.save = function(obj) {
      
            var items = [

                'id',
                'value',
                      
            ];

            common.items(obj,items, function(data) {

                API.PUT(resource,data,function(response) {

                    if (response > 0) {

                        common.message('Success!',function() {

                            $scope.poll();

                        });

                    } else {

                        common.message('Failed');

                    }

                });

            });

        };

        $scope.sortBy = function(col) {

            var sort = $localStorage[resource].sort;

            var order = sort.slice(0,1);

            var by = sort.slice(1);

            if (by === col) {

                if (order === '-') {

                    order = '+';

                } else {

                    order = '-';

                }

            }

            $localStorage[resource].sort = order + col;
           
        };

        var columns = function(json,callback) {

            if (callback) {

                common.columns(json, function(array) {

                    array.splice(2,1);

                    callback(array);

                });

            }

        };

        $scope.poll = function() {

            API.GET(resource, function(json) {

                $scope.data = json;

                columns(json, function(cols) {

                    $scope.columns = cols;

                });

                //console.log($scope.data);

                //console.log($scope.columns);

                //return;
            
                $localStorage[resource].data = $scope.data;

                $localStorage[resource].columns = $scope.columns;

                $scope.ready = true;

            });

        };
          
        init();

        $scope.poll();

    }

]);