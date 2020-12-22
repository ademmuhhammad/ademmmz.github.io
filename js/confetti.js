/**
 * Original library => dom-confetti
 * https://github.com/daniel-lundin/dom-confetti
 */

var defaultColors = ['#blue', '#cyan','#red','#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'];

var shape = function shape(element) {
  var list = [
  // Square
  function (e) {
    var size = Math.round((Math.random() + 0.5) * 15) + 'px';
    e.style.width = size;
    e.style.height = size;
    return e;
  },
  // Round
  function (e) {
    var size = Math.round((Math.random() + 0.5) * 15) + 'px';
    e.style.width = size;
    e.style.height = size;
    e.style['border-radius'] = '50%';
    return e;
  },
  // Triangle
  function (e) {
    var size = '' + Math.round((Math.random() + 0.5) * 20);
    var color = e.style['background-color'];
    e.style['background-color'] = 'transparent';

    e.style['border-bottom'] = size + 'px solid ' + color;
    e.style['border-left'] = size / 8 + 'px solid transparent';
    e.style['border-right'] = size / 8 + 'px solid transparent';
    e.style.height = 100;
    e.style.width = size;

    return e;
  }];

  return list[Math.floor(Math.random() * list.length)](element);
};

function createElements(root, elementCount, colors) {
  return Array.from({ length: elementCount }).map(function (_, index) {
    var element = document.createElement('div');
    var color = colors[index % colors.length];
    element.style['background-color'] = color; // eslint-disable-line space-infix-ops
    element.style.position = 'absolute';
    root.appendChild(shape(element));
    return element;
  });
}

function randomPhysics(angle, spread, startVelocity, random) {
  var radAngle = angle * (Math.PI / 120);
  var radSpread = spread * (Math.PI / 50);
  return {
    x: 0,
    y: 0,
    wobble: random() * 1,
    velocity: startVelocity * 0.1 + random() * startVelocity,
    angle2D: -radAngle + (1 * radSpread - random() * radSpread),
    angle3D: -(Math.PI / 10) + random() * (Math.PI / 2),
    tiltAngle: random() * Math.PI
  };
}

function updateFetti(fetti, progress, decay) {
  /* eslint-disable no-param-reassign */
  fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
  fetti.physics.wobble += 0.1;
  fetti.physics.velocity *= decay;
  fetti.physics.y += 2;
  fetti.physics.tiltAngle += 0.1;

  var _fetti$physics = fetti.physics,
      x = _fetti$physics.x,
      y = _fetti$physics.y,
      tiltAngle = _fetti$physics.tiltAngle,
      wobble = _fetti$physics.wobble;

  var wobbleX = x + 10 * Math.cos(wobble);
  var wobbleY = y + 10 * Math.sin(wobble);
  var transform = 'translate3d(' + wobbleX + 'px, ' + wobbleY + 'px, 0) rotate3d(1, 1, 1, ' + tiltAngle + 'rad)';

  fetti.element.style.transform = transform;
  fetti.element.style.opacity = 1 - progress;

  /* eslint-enable */
}

function animate(root, fettis, decay) {
  var totalTicks = 2000;
  var tick = 0;

  function update() {
    fettis.forEach(function (fetti) {
      return updateFetti(fetti, tick / totalTicks, decay);
    });

    tick += 1;
    if (tick < totalTicks) {
      requestAnimationFrame(update);
    } else {
      fettis.forEach(function (fetti) {
        if (fetti.element.parentNode === root) {
          return root.removeChild(fetti.element);
        }
      });
    }
  }

  requestAnimationFrame(update);
}

window.confetti = function (root) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$angle = _ref.angle,
      angle = _ref$angle === undefined ? 90 : _ref$angle,
      _ref$decay = _ref.decay,
      decay = _ref$decay === undefined ? 0.9 : _ref$decay,
      _ref$spread = _ref.spread,
      spread = _ref$spread === undefined ? 45 : _ref$spread,
      _ref$startVelocity = _ref.startVelocity,
      startVelocity = _ref$startVelocity === undefined ? 45 : _ref$startVelocity,
      _ref$elementCount = _ref.elementCount,
      elementCount = _ref$elementCount === undefined ? 50 : _ref$elementCount,
      _ref$colors = _ref.colors,
      colors = _ref$colors === undefined ? defaultColors : _ref$colors,
      _ref$random = _ref.random,
      random = _ref$random === undefined ? Math.random : _ref$random;

  var elements = createElements(root, elementCount, colors);
  var fettis = elements.map(function (element) {
    return {
      element: element,
      physics: randomPhysics(angle, spread, startVelocity, random)
    };
  });

  animate(root, fettis, decay);
};