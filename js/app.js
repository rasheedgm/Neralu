app = angular.module('stockMng', ["firebase"]);
app.controller('appCtrl', ["$scope", "$firebaseObject",function($scope,$firebaseObject) {
    // Initialize Firebase
    //var ref = new Firebase("https://dbstock.firebaseio.com/");
    var ref = firebase.database().ref();  
    var membObject = $firebaseObject(ref.child("members"));   
    var projObject = $firebaseObject(ref.child("projects"));   
    var accountObject =$firebaseObject(ref.child("accounts"));
    $scope.members = membObject;
    $scope.projects = projObject;
    $scope.accounts = accountObject;
    $scope.user={};
    $scope.user.auth =function(){ 
        firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password)
            .then(function(userData){
            console.log("Loged In As: "+ userData.email);
            userAuthenticated();
        })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode,errorMessage);
            // ...
        })
    }
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            $scope.user.authenticated =true;
        } else {
            // No user is signed in.
            $scope.user.authenticated =false;
        }
    });
    $scope.user.unauth=function(){   
        firebase.auth().signOut().then(function() {
        }, function(error) {
        });
    }
    function userAuthenticated(){
        $scope.user.authenticated =true;
    }
    $scope.addNewMember = function(){ 
        var tempNewMember={"Id": $scope.newMember.Id,"Name":$scope.newMember.Name,"Phone":$scope.newMember.Phone};
        $scope.members[$scope.newMember.Id]=tempNewMember;  
        $scope.members.$save().then(function(ref) {            
            $scope.newMember=emptyMember();
            tempNewMember={};
            alert("Updated");
        }, function(error) {
            alert("Something Went wrong: " , error);
        });
    }
    
    $scope.checkMember=function(membId){
        if($scope.members[membId]){
            $scope.messageCustExist=true; 
        }
        else{
            $scope.messageCustExist=false;
        }
    }
    $scope.editMember= function(membId){
        $scope.messageCustExist=false;
        $scope.newMember=$scope.members[membId];
    }
    
    //new Project   
        $scope.newProject={}; 
        $scope.addNewProject=function(){
            $scope.projects.counter = ($scope.projects.counter||0) +1;   
            var projectId = $scope.projects.counter;
            projectId =  "PROJ"+ pad(projectId);
            $scope.newProject.Id=projectId;            
            var tempNewProject={"Id" : $scope.newProject.Id,"Name": $scope.newProject.Name,"Details": $scope.newProject.Details,"Contact": $scope.newProject.Contact};
            $scope.projects[tempNewProject.Id]=tempNewProject;
            $scope.projects.$save().then(function(ref) {            
            $scope.newProject={};
                alert("Updated");
            }, function(error) {
                alert("Something Went wrong: " , error);
            });

    }
        //New project end
    
    //new accounts   
        $scope.newAccount={};
        $scope.newAccount.Date = new Date();    
        $scope.addNewAccount=function(){
        $scope.accounts.counter = ($scope.accounts.counter||0) +1;
        var accountId = $scope.accounts.counter;
        accountId =  "ACT"+ pad(accountId);
        $scope.newAccount.Id=accountId;
        var tempNewAccount={"Id" : $scope.newAccount.Id,
                            "Date" :$scope.newAccount.Date.getTime(),
                            "AmountPromised": $scope.newAccount.AmountPromised,
                            "AmountPaid": ($scope.newAccount.AmountPaid||0),
                            "Project": $scope.newAccount.Project,
                            "Representative": $scope.newAccount.Representative,
                            "Zone": $scope.newAccount.Zone,
                            "PaymentMode": "Cash"
                           };
        $scope.accounts[tempNewAccount.Id]=tempNewAccount;
        $scope.accounts.$save().then(function(ref) {            
            $scope.newAccount={};
            $scope.newAccount.Date = new Date();
            alert("Updated");
        }, function(error) {
            alert("Something Went wrong: " , error);
        });

    }
        //New account end
    
    
    
}]);

app.directive('home',function(){
    return{
        restrict: 'E',
        templateUrl: 'templates/home.html'
    }
});
app.directive('project',function(){
    return{
        restrict: 'E',
        templateUrl: 'templates/project.html'
    }
});app.directive('account',function(){
    return{
        restrict: 'E',
        templateUrl: 'templates/account.html'
    }
});
app.directive('member',function(){
    return{
        restrict: 'E',
        templateUrl: 'templates/member.html'
    }
});