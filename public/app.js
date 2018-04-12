angular.module('app', []);

angular
    .module('app')
    .controller('appCtrl', AppCtrl);

AppCtrl.$inject = ['$scope', '$http'];

function AppCtrl($scope, $http) {
    var vm = this;
    vm.fields = [
        {label: 'user_id', key: 'user_id'},
        {label: 'username', key: 'username'},
        {label: 'location', key: 'location'},
        {label: 'org', key: 'org'}
    ];
    vm.user = {};
    vm.users = [];

    vm.handleError = function(response) {
        console.log(response.status + " - " + response.statusText + " - " + response.data);
    }

    vm.getAllUsers = function() {
        $http.get('/users').then(function(response){
            vm.users = response.data;
        }, function(response){
            vm.handleError(response);
        });
    }

    vm.getAllUsers();

    vm.editMode = false;
    vm.saveUser = function() {
        if(vm.editMode) {
            vm.updateUser();
        } else {
            vm.addUser();
        }
    }

    vm.addUser = function() {
        console.log(vm.user);
        $http.post('/users', vm.user).then(function(response){
            vm.user = {};
            vm.getAllUsers();
        }, function(response){
            vm.handleError(response);
        });
    }

    vm.updateUser = function() {
        $http.put('/users/' + vm.user._id, vm.user).then(function(response){
            vm.user = {};
            vm.getAllUsers();
            vm.editMode = false;
        }, function(response){
            vm.handleError(response);
        });
    }

    vm.editUser = function(user) {
        vm.user = user;
        vm.editMode = true;
    }

    vm.deleteUser = function(userid) {
        $http.delete('/users/'+userid).then(function(response){
            console.log("Deleted");
            vm.getAllUsers();
        }, function(response){
            vm.handleError(response);
        })
    }

    vm.cancelEdit = function() {
        vm.editMode = false;
        vm.user = {};
        vm.getAllUsers();
    }

}
