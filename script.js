/**
* Hangman - AngularJS
* @author Thomas Berdeaux <tjberdeaux@gmail.com>
* Updated: 2017-03-27
*/
angular.module("hmmApp", [])
  .controller("hmmCtrl", function($scope, $http, $timeout) {
    var wordnikURL = "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=8000&maxCorpusCount=-1&minDictionaryCount=3&maxDictionaryCount=-1&minLength=6&maxLength=12&api_key=";
    /* Get a Wordnik API Key */
    var APIKey = "";
    $scope.alphabet = $scope.guesses = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $scope.active = $scope.success = false;
    $scope.wrong = 99;

    /* Initialize the feedback banner */
    $scope.banner = {
      message: "press start!",
      style: "info",
      loading: false,
      set: function(message, style, loading) {
        this.message = message,
        this.style = style,
        this.loading = loading
      }
    };

    /* Perform a guess */
    $scope.guess = function(guess) {
      /* Add letter to 'guesses' and increase 'wrong' counter (if wrong) */
      $scope.guesses += guess;
      if($scope.secret.indexOf(guess) < 0 && ++$scope.wrong >= 6) {
        /* Out of guesses. Game Over */
        $scope.active = $scope.success = false;
        $scope.banner.set("you killed me!", "fail");
      } else if(!$scope.secret.replace(new RegExp("["+$scope.guesses+"]","gi"),"").length) {
          /* Secret revealed. Game over */
          $scope.active = false;
          $scope.success = true;
          $scope.wrong = 0; /* Un-hang hang man */
          $scope.banner.set("you saved me!", "win");
        }
    };

    /* Start a new game */
    $scope.start = function() {
      $scope.secret = $scope.guesses = "";
      $scope.wrong = 0;
      $scope.banner.set("loading..", "info", true);
      setWord();
    };

    /* Fetch a new word between 6 and 12 characters */
    function setWord() {
      if(APIKey) {
        $http.get(wordnikURL+APIKey).then(
          function(resp) {
            if(/^[a-zA-Z]{6,12}$/.test(resp.data.word)) {
              $scope.banner.set();
              $scope.secret = resp.data.word.toUpperCase();
              $scope.active = true;
            } else {
              $scope.banner.set("still loading..", "info", true);
              setWord();
            }
          }, function(resp) {
            $scope.banner.set("cannot find words :(", "fail");
          }
        );
      } else {
        /* No APIKey */
        console.log("Sign up for a Wordnik account and get an API key!");
        var words = ["anticipation", "arugula", "authorship", "barrier", "delicacy", "diplomacy", "drilling", "forecaster", "giggles", "hospice", "houses", "imagination", "infatuation", "intercession", "malaria", "memoir", "monastery", "nourishment", "probation", "rotting", "semblance", "sending", "slowing", "stairway", "surveying", "thickness", "twenties", "waterfront", "wiring", "wisdom"];
        $scope.secret = words[Math.floor(Math.random()*words.length)].toUpperCase();
        $scope.banner.set();
        $scope.active = true;
      }
    };
  });
