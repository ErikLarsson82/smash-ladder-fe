import * as PIXI from 'pixi.js'
import * as TWEEN from 'tween.js'

const centerX = Math.round(window.innerWidth / 2)
const centerY = Math.round(window.innerHeight / 2)

let app, pvp, last, done, backgroundGraphics

let p1sprite, p1coord, p1tween
let p2sprite, p2coord, p2tween

function gameLoop(time) {
  if (done === false) requestAnimationFrame(gameLoop)
  p1sprite.x = p1coord.x
  p2sprite.x = p2coord.x
  TWEEN.update(time)
}

function setup() {
  done = false

  setTimeout(() => {
    done = true
    app.view.remove()
  }, 2000)

  rect()

  p1sprite = new PIXI.Sprite.from('battle-stance/leftfacing/bowser.png')
  p1sprite.x = 0
  p1sprite.y = 0
  app.stage.addChild(p1sprite)

  p2sprite = new PIXI.Sprite.from('battle-stance/rightfacing/yoshi.png')
  p2sprite.x = 0
  p2sprite.y = 0
  app.stage.addChild(p2sprite)

  pvp = new PIXI.Sprite.from('player-versus-player.png')
  pvp.x = centerX - 82
  pvp.y = centerY - 82
  app.stage.addChild(pvp)

  last = new Date().getTime()

  p1coord = { x: -750 }
  p2coord = { x: window.innerWidth }

  p1tween = new TWEEN.Tween(p1coord)
    .to({ x: centerX + 100 }, 600)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()

  p2tween = new TWEEN.Tween(p2coord)
    .to({ x: centerX - 850 }, 600)
    .easing(TWEEN.Easing.Quadratic.Out)
    .delay(1000)
    .start()

  gameLoop()
}

function rect() {
  backgroundGraphics = new PIXI.Graphics()
  backgroundGraphics.beginFill(0x000000)
  backgroundGraphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
  app.stage.addChild(backgroundGraphics)
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
