angular.module('conFusion.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
       console.log('Doing login', $scope.loginData);
      $localStorage.storeObject('userinfo',$scope.loginData);



    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

    // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  }; //end of modal

  

})


    .controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup) 
    {

            $scope.baseURL = baseURL;    
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            $scope.dishes = dishes;
            


            $scope.addFavorite = function (index) {
              console.log("index is " + index);
              favoriteFactory.addToFavorites(index);
             
              $ionicListDelegate.closeOptionButtons();

              var alertPopup = $ionicPopup.alert({
                      title: 'Added',
                      template: 'Thank you!'
                  });
              alertPopup.then(function (res) {
                   });
               };//end of addFavorite

                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])


        
          .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal','$ionicPopup',  '$timeout', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPopup, $timeout) {

            
            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";
           
            
            // .fromTemplateUrl() method
            $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
              scope: $scope
            }).then(function(popover) {
              $scope.popover = popover;
            });

            $scope.openPopover = function($event) {
              $scope.popover.show($event);
            };
        

            $scope.dish = dish;

            $scope.addFavorite = function () {
         
              favoriteFactory.addToFavorites($scope.dish.id);
              $scope.popover.hide();
               
              var alertPopup = $ionicPopup.alert({
                      title: 'Added',
                      template: 'Thank you!'
                  });
              alertPopup.then(function (res) {
                   });
               };//end of addFavorite

             //modal
             $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                scope: $scope
              }).then(function(modal) {
                $scope.commentForm = modal;
              });

              // Triggered in the reserve modal to close it
              $scope.closeComment = function() {
                $scope.commentForm.hide();
              };

              // Open the reserve modal
              $scope.comment = function() {
                $scope.commentForm.show();
                $scope.popover.hide();
              };

              // Perform the reserve action when the user submits the reserve form
              $scope.mycomment = {rating:5, comment:"", author:"", date:""};
              $scope.doComment = function() {
                     $scope.mycomment.date = new Date().toISOString();
                     $scope.dish.comments.push($scope.mycomment);
                     menuFactory.update({id:$scope.dish.id},$scope.dish);
                     $scope.mycomment = {rating:5, comment:"", author:"", date:""};

                    // Simulate a reservation delay. Remove this and replace with your reservation
                    // code if using a server system
                     $timeout(function() {
                      $scope.closeComment();
                    }, 400);
                  }; //end of doComment
              
           
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here

      .controller('IndexController', ['$scope','dish','leader', 'promotion', 'baseURL', function ($scope, dish, leader, promotion, baseURL) {

            $scope.baseURL = baseURL;
            $scope.leader = leader;
            $scope.showDish = false;
            $scope.message = "Loading ...";
            $scope.dish = dish;
            $scope.promotion = promotion;

        }])



        .controller('AboutController', ['$scope', 'leaders','baseURL', function($scope, leaders, baseURL) {

                    $scope.baseURL = baseURL;
                    $scope.leaders = leaders;
                    console.log($scope.leaders);
            
                    }])

        .controller('FavoritesController', ['$scope','$localStorage','dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, $localStorage, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {


                 $scope.baseURL = baseURL;
                 $scope.shouldShowDelete = false;
                 
                 $scope.favorites = favorites;// favorites is an array

                 $scope.dishes = dishes;
                 //$scope.dishes=$localStorage.getObject('userfavorites','{}');

              $scope.toggleDelete = function () {
                  $scope.shouldShowDelete = !$scope.shouldShowDelete;
                  console.log($scope.shouldShowDelete);
              }

              $scope.deleteFavorite = function (index) {

                  var confirmPopup = $ionicPopup.confirm({
                      title: 'Confirm Delete',
                      template: 'Are you sure you want to delete this item?'
                  });

                  confirmPopup.then(function (res) {
                      if (res) {
                          console.log('Ok to delete');
                          favoriteFactory.deleteFromFavorites(index);
                       
                      } else {
                          console.log('Canceled delete');
                      }
                  });

                  $scope.shouldShowDelete = false;
                }

           }])
.filter('favoriteFilter', function () {  // Fileter is function whose name is favoriteFilter
    return function (dishess, favoritess) // filter returns an array named "out"
    {
        var out = [];
        for (var i = 0; i < favoritess.length; i++) 
          {
            for (var j = 0; j < dishess.length; j++) 
              {
                if (dishess[j].id === favoritess[i].id)
                    out.push(dishess[j]);
              }//end of inside for
          }//end of big for
        return out;

    }// end of return outide
  });


