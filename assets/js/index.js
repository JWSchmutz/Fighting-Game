var roroko = $("#roroko");
var rorokoHp = 100;
var shroomageHp = 100;
var shroomage = $("#shroomage");
const startingX = roroko.position().left;
const startingY = roroko.position().top;
const startingYInPx = "" + startingY + "px";
var shroomageLeft = shroomage.left;
const shroomageRight = shroomage.position().left + shroomage.width();
var shroomageSrc = 0;
var spikeTops = $(".container").height * 0.04;
var gameOver = false;
var attackTimer = 0;
var jumpTimer = 0;
var left = false;
var right = true;
var pos;
let gp;

const moveLeft = () => {
  if (!gameOver) {
    //get roroko's position based on percentage.
    pos = (roroko.position().left / roroko.parent().width()) * 100;
    //turn roroko if she isn't facing the direction placed
    if (!left) {
      left = true;
      right = false;
      roroko.addClass("flipped");
      roroko.attr("src", "assets/images/roroko-run.gif");
      //move roroko that direction if she isn't at that end of the screen
    } else if (pos > 0) {
      roroko.animate({ left: "-=1.6%" }, { duration: 1, queue: false });
    }
  }
};

const moveRight = () => {
  if (!gameOver) {
    //get roroko's position based on percentage.
    pos = (roroko.position().left / roroko.parent().width()) * 100;
    //turn roroko if she isn't facing the direction placed
    if (!right) {
      left = false;
      right = true;
      roroko.removeClass("flipped");
      roroko.attr("src", "assets/images/roroko-run.gif");
      //move roroko that direction if she isn't at that end of the screen
    } else if (pos < 100 - (roroko.width() / roroko.parent().width()) * 100) {
      roroko.animate({ left: "+=1.6%" }, { duration: 1, queue: false });
      roroko.attr("src", "assets/images/roroko-run.gif");
    } else {
      // window.location.replace("index2.html");
    }
  }
};

const attack = () => {
  if (attackTimer === 0 && !gameOver) {
    attackTimer++;
    roroko.attr("src", "assets/images/roroko-attack-2.gif");
    if (left) {
      var shiftToLeft = roroko.width() * -0.25 + roroko.position().left;
      roroko.css("left", shiftToLeft);
    }

    if (
      (roroko.position().left + roroko.width() - 20 >
        shroomage.position().left &&
        right &&
        roroko.position().left < shroomage.position().left) ||
      (roroko.position().left + 20 <
        shroomage.position().left + shroomage.width() &&
        left &&
        roroko.position().left > shroomage.position().left)
    ) {
      setTimeout(function () {
        shroomageHp -= 10;
        $("#shroomage-hp").css("width", shroomageHp + "%");
        if (shroomageHp <= 0) {
          shroomage.attr("src", "assets/images/shroomage-damaged.gif");
          win();
        }
      }, 200);
    }

    setTimeout(function () {
      attackTimer--;
      roroko.attr("src", "assets/images/roroko.gif");
      if (left) {
        var shiftToLeft = roroko.width() * 0.35 + roroko.position().left;
        roroko.css("left", shiftToLeft);
      }
    }, 300);
  }
};

const jump = () => {
  if (jumpTimer === 0 && !gameOver) {
    jumpTimer++;
    roroko.animate({ top: "-=12%" }, 3);
    roroko.animate({ top: "-=8%" }, 3);
    roroko.animate({ top: "-=4.5%" }, 3);
    roroko.animate({ top: "-=2%" }, 3);
    roroko.animate({ top: "-=.5%" }, 3);
    roroko.animate({ top: "-=.25%" }, 3);
    roroko.animate({ top: "+=.25%" }, 3);
    roroko.animate({ top: "+=.5%" }, 3);
    roroko.animate({ top: "+=2%" }, 3);
    roroko.animate({ top: "+=4.5%" }, 3);
    roroko.animate({ top: "+=8%" }, 3);
    roroko.animate({ top: "+=12%" }, 3);
    setTimeout(function () {
      jumpTimer--;
      roroko.css("top", startingY);
    }, 200);
  }
};

window.addEventListener("gamepadconnected", function (e) {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length
  );
  gp = navigator.getGamepads()[e.gamepad.index];
  setInterval(function () {
    if (!gp || gameOver) return;
    const newGp = navigator.getGamepads()[e.gamepad.index];
    console.log(newGp.buttons, newGp.axes[0]);
    const jumpIsPressed = newGp.buttons[0].pressed;
    const attackIsPressed = newGp.buttons[7].pressed;
    const moveLeftIsPressed = newGp.axes[0] <= -0.5;
    const moveRightIsPressed = newGp.axes[0] >= 0.5;
    const notMovingOrAttacking =
      newGp.axes[0] >= -0.5 && newGp.axes[0] <= 0.5 && !attackTimer;
    if (moveLeftIsPressed) return moveLeft();
    if (moveRightIsPressed) return moveRight();
    if (attackIsPressed) return attack();
    if (jumpIsPressed) return jump();
    if (notMovingOrAttacking) roroko.attr("src", "assets/images/roroko.gif");
  }, 1);
});

setInterval(function controlShroomage() {
  if (!gameOver) {
    if (
      shroomage.position().left <
        roroko.position().left + roroko.width() * 0.78 &&
      shroomage.position().left > roroko.position().left
    ) {
      shroomage.attr("src", "assets/images/shroomage-attack.gif");
      if (shroomageSrc === 0) {
        shroomage.animate({ left: "-=1.2%" }, { duration: 1, queue: false });
      }
      shroomageSrc = 1;
      rorokoHp -= 10;
      $("#roroko-hp").css("width", rorokoHp + "%");
      loss();
    } else if (
      shroomage.position().left + shroomage.width() >
        roroko.position().left + roroko.width() * 0.22 &&
      shroomage.position().left < roroko.position().left
    ) {
      shroomageSrc = 1;
      shroomage.attr("src", "assets/images/shroomage-attack.gif");
      // shroomage.animate({ left: "-=.1%" }, { duration: 1, queue: false });
      rorokoHp -= 10;
      $("#roroko-hp").css("width", rorokoHp + "%");
      loss();
    } else {
      if (shroomageSrc === 1)
        shroomage.attr("src", "assets/images/shroomage-walk.gif");
      shroomageSrc = 0;
      if (
        shroomage.position().left >
        roroko.position().left + roroko.width() * 0.5
      ) {
        shroomage.animate({ left: "-=.6%" }, { duration: 199, queue: false });
        shroomage.addClass("flipped");
      }
      if (
        shroomage.position().left + shroomage.width() <
        roroko.position().left + roroko.width() * 0.5
      ) {
        shroomage.animate({ left: "+=.6%" }, { duration: 199, queue: false });
        shroomage.removeClass("flipped");
      }
    }
  }
}, 200);

// Keyboard input with customisable repeat (set to 0 for no key repeat)
//
function KeyboardController(keys, repeat) {
  // Lookup of key codes to timer ID, or null for no repeat
  //
  var timers = {};

  // When key is pressed and we don't already think it's pressed, call the
  // key action callback and set a timer to generate another one after a delay
  //
  document.onkeydown = function (event) {
    var key = (event || window.event).keyCode;
    if (!(key in keys)) return true;
    if (!(key in timers)) {
      timers[key] = null;
      keys[key]();
      if (repeat !== 0) timers[key] = setInterval(keys[key], repeat);
    }
    return false;
  };

  // Cancel timeout and mark key as released on keyup
  //
  document.onkeyup = function (event) {
    var key = (event || window.event).keyCode;
    if (key in timers) {
      if (timers[key] !== null) clearInterval(timers[key]);
      delete timers[key];
    }
    if (event.keyCode === 37 || event.keyCode === 39) {
      roroko.attr("src", "assets/images/roroko.gif");
    }
  };

  // When window is unfocused we may not get key events. To prevent this
  // causing a key to 'get stuck down', cancel all held keys
  //
  window.onblur = function () {
    for (key in timers) if (timers[key] !== null) clearInterval(timers[key]);
    timers = {};
  };
}
KeyboardController(
  {
    37: moveLeft,
    39: moveRight,
  },
  20
);
//jumping
$(document).keydown(function (e) {
  if (e.keyCode === 38) jump();
  if (e.keyCode === 32) attack();
});

function loss() {
  if (rorokoHp <= 0) {
    $(".failure").removeClass("hidden");
    gameOver = true;
    roroko.animate({ opacity: "0" }, 700);
  }
}

function win() {
  if (shroomageHp <= 0) {
    $(".victory").removeClass("hidden");
    gameOver = true;
    shroomage.animate({ opacity: "0" }, 700);
  }
}

$(".play-again").click(function () {
  location.reload();
});
