/* ************************************************
** GAME PLAYER CLASS
************************************************ */
var Player = function (startX, startY) {
  var x = startX;
  var y = startY;
  var sx = startX;
  var sy = startY;
  var id;
  var r = 0;
  var sr = 0;

  // Getters and setters
  var getX = function () {
    return x;
  }

  var getY = function () {
    return y;
  }

  var getSX = function () {
    return sx;
  }

  var getSY = function () {
    return sy;
  }

  var getR = function () {
    return r;
  }

  var getSR = function (newR) {
    return sr;
  }

  var setX = function (newX) {
    x = newX;
  }

  var setY = function (newY) {
    y = newY;
  }

  var setSX = function (newSX) {
    sx = newSX;
  }

  var setSY = function (newSY) {
    sy = newSY;
  }

  var setR = function (newR) {
    r = newR;
  }

  var setSR = function (newSR) {
    sr = newSR;
  }

  // Define which variables and methods can be accessed
  return {
    getX: getX,
    getY: getY,
    getSX: getSX,
    getSY: getSY,
    getR: getR,
    getSR: getSR,
    setX: setX,
    setY: setY,
    setSX: setSX,
    setSY: setSY,
    setR: setR,
    setSR: setSR,
    id: id
  }
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Player
