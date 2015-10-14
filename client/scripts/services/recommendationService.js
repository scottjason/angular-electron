'use strict';

angular.module('app')
  .service('RecommendationService', RecommendationService);

function RecommendationService() {

  function send(selectedProduct, fittingRoom, allProducts, cb) {

    var foundMatch = false;
    var isPriceBased = false;
    var bestMatch = {}
    var highestScore = 0;

    var targetTitle = selectedProduct.title;
    var targetPrice = parseInt(selectedProduct.cost.split('$')[1]);

    var ref = new Firebase('https://retail-store-app.firebaseio.com/recommendations');

    // first see if there's already an association, if not send the recommendation based on price, plus or minus $20 range
    ref.once("value", function(snapshot) {
        var obj = snapshot.val();
        angular.forEach(obj, function(incoming, key) {

          var isMatch = (targetTitle === incoming.firstShownName);
          var isHighestScore = (incoming.score >= highestScore);

          if (isMatch && isHighestScore) {
            foundMatch = true;
            bestMatch.title = incoming.recommendedName;
            highestScore = incoming.score;
          }
        });

        if (foundMatch) {
          bestMatch.firstShown = {};
          bestMatch.firstShown.title = targetTitle;
          fittingRoom.recommendations.push(bestMatch);
          console.log('found a previously associated recommendation', bestMatch);
        } else {

          for (var i = 0; i < allProducts.length; i++) {

            var incomingPrice = parseInt(selectedProduct.cost.split('$')[1]);
            var diffInPrice = (targetPrice - incomingPrice);
            diffInPrice = (diffInPrice > 0) ? diffInPrice : (diffInPrice * -1);

            if (diffInPrice <= 20 && targetTitle !== allProducts[i].title) {
              delete allProducts[i].$id;
              delete allProducts[i].$priority;
              allProducts[i].firstShown = {};
              allProducts[i].firstShown.title = targetTitle;
              fittingRoom.recommendations.push(allProducts[i]);
              console.log('found price-based recommendation', allProducts[i]);
              isPriceBased = true;
              break;
            }
          }
        }
        cb(true, isPriceBased);
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
        cb(null, 1)
      });
  }

  return {
    send: send
  }
}
