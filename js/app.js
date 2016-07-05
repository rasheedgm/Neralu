app = angular.module('stockMng', ["firebase"]);
app.controller('appCtrl', ["$scope", "$firebaseObject","$firebaseArray",function($scope,$firebaseObject,$firebaseArray) {
    // Initialize Firebase
    //var ref = new Firebase("https://neralu-99f71.firebaseio.com");
    var ref = firebase.database().ref();  
    $scope.members = $firebaseArray(ref.child("members"));       
    $scope.projects = $firebaseArray(ref.child("projects"));   
    $scope.accounts =$firebaseArray(ref.child("accounts"));  
    $scope.zones =$firebaseArray(ref.child("zones")); 
    $scope.show={};
    $scope.show.Details=false;
    $scope.user={};
    $scope.user.auth =function(){ 
        firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password)
            .then(function(userData){
            console.log("Loged In As: "+ userData.email);
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
            $scope.$apply();
        } else {
            // No user is signed in.
            $scope.user.authenticated =false;
            $scope.$apply();
        }
    });
    $scope.user.unauth=function(){   
        firebase.auth().signOut().then(function() {
        }, function(error) {
        });
    }
    
    $scope.getProjectTotalPromised = function(projId){
        var totalPromise =0;
        angular.forEach($scope.accounts, function(account,key){
            if(account.Project==projId){
                totalPromise=totalPromise+account.AmountPromised;
            }
        });
        return(totalPromise);
        
        
    }
    $scope.getProjectTotalPaid = function(projId){
        var totalPaid =0;
        angular.forEach($scope.accounts, function(account,key){
            if(account.Project==projId){
                totalPaid=totalPaid+account.AmountPaid;
            }
        });
        return(totalPaid);
    }
    $scope.clickList = function(pId){
        $scope.show.selectedProject=pId;
    }
    $scope.toggleDetails = function(){
        if ($scope.show.Details){
            $scope.show.Details=false;
            $scope.show.$apply;
        }else{
            $scope.show.Details=true;            
            $scope.show.$apply;
        }
    }
    
    //new member
    $scope.addNewMember = function(){ 
        var tempNewMember={"Id": $scope.newMember.Id,"Name":$scope.newMember.Name,"Phone":$scope.newMember.Phone};
        //$scope.members[$scope.newMember.Id]=tempNewMember; 
        $scope.members.$add(tempNewMember);
        /*$scope.members.$save().then(function(ref) {            
            $scope.newMember=emptyMember();
            tempNewMember={};
            alert("Updated");
        }, function(error) {
            alert("Something Went wrong: " , error);
        });*/
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
            //$scope.projects.counter = ($scope.projects.counter||0) +1;   
            //var projectId = $scope.projects.counter;
            //projectId =  "PROJ"+ pad(projectId);
            //$scope.newProject.Id=projectId;            
            var tempNewProject={"Name": $scope.newProject.Name,"Details": $scope.newProject.Details,"Contact": $scope.newProject.Contact};
            //$scope.projects[tempNewProject.Id]=tempNewProject;
            //$scope.projects=tempNewProject;
            $scope.projects.$add(tempNewProject).then(function(ref) {            
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
        //$scope.accounts.counter = ($scope.accounts.counter||0) +1;
        //var accountId = $scope.accounts.counter;
        //accountId =  "ACT"+ pad(accountId);
        //$scope.newAccount.Id=accountId;
        var tempNewAccount={"Date" :$scope.newAccount.Date.getTime(),"Name":$scope.newAccount.Name,"AmountPromised": ($scope.newAccount.AmountPromised||0),"AmountPaid": ($scope.newAccount.AmountPaid||0),"Project": $scope.newAccount.Project,"Representative": $scope.newAccount.Representative,"Zone": $scope.newAccount.Zone,"PaymentMode": "Cash"};
        //$scope.accounts[tempNewAccount.Id]=tempNewAccount;
        $scope.accounts.$add(tempNewAccount).then(function(ref) {            
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
app.directive('proj-details',function(){
    return{
        restrict: 'E',
        templateUrl: 'templates/proj-details.html'
    }
});