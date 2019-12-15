import * as PIXI from 'pixi.js'
import * as TWEEN from 'tween.js'

let app, p1, p2, pvp, last, coords, tweener, done

function gameLoop(time) {
  if (done === false) requestAnimationFrame(gameLoop)
  p1.x = coords.p1
  p2.x = coords.p2
  TWEEN.update(time)
}

function setup() {
  done = false

  setTimeout(() => {
    done = true
    app.view.remove()
  }, 2000)

  p1 = new PIXI.Sprite.from('battle-stance/leftfacing/bowser.png')
  p1.x = 0
  p1.y = 0
  app.stage.addChild(p1)

  p2 = new PIXI.Sprite.from('battle-stance/rightfacing/yoshi.png')
  p2.x = 0
  p2.y = 0
  app.stage.addChild(p2)

  pvp = new PIXI.Sprite.from('player-versus-player.png')
  pvp.x = Math.round(window.innerWidth / 2) - 82
  pvp.y = Math.round(window.innerHeight / 2) - 82
  app.stage.addChild(pvp)

  last = new Date().getTime()

  coords = { p1: -750, p2: window.innerWidth }
  tweener = new TWEEN.Tween(coords)
    .to({ p1: window.innerWidth - 600, p2: -150 }, 600)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()

  gameLoop()
}

export default function startAnimation() {

  const config = {
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true
  }
  app = new PIXI.Application(config)
  app.view.style = "position: absolute; top: 0; left: 0"
  
  document.body.appendChild(app.view)

  app.loader
    .add('battle-stance/leftfacing/bowser.png')
    .add('battle-stance/rightfacing/yoshi.png')
    .add('player-versus-player.png')
    .load(setup)  
}
