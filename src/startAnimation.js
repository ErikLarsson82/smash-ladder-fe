import * as PIXI from 'pixi.js'
import * as TWEEN from 'tween.js'

const centerX = Math.round(window.innerWidth / 2)
const centerY = Math.round(window.innerHeight / 2)

let app
/*
function shakeAnimation(element){
  TweenMax.to(element, .1, {
    x: -7,
    ease: Quad.easeInOut
  });
  TweenMax.to(element, .1, {
    repeat: 4,
    x: 7,
    yoyo: true,
    delay: .1,
    ease: Quad.easeInOut
  });
  TweenMax.to(element, .1, {
    x: 0,
    delay: .1 * 4
  });
}
*/
function setupAnimation() {
  
  blackrect()
  gameLoop()
}

function shake(dir) {

  /*const start = new TWEEN.Tween(app.stage)
    .easing(TWEEN.Quad.Ease.In)
    .to({ y: 14 }, 60)
    .repeat(2)
    .start()
    .chain(goBack)*/

  /*const goBack = new TWEEN.Tween(app.stage)
    .to({ x: 10, y: 10 }, 10)
    
  new TWEEN.Tween(app.stage)
    .easing(TWEEN.Easing.Bounce.In)
    .to({ y: 14 }, 60)
    .repeat(2)
    .start()
    .chain(goBack)

  new TWEEN.Tween(app.stage)
    .easing(TWEEN.Easing.Bounce.Out)
    .to({ x: dir ? 20 : 0 }, 120)
    .repeat(1)
    .start()*/
}

function gameLoop(time) {
  requestAnimationFrame(gameLoop)
  TWEEN.update(time)
}

function cleanup() {
  gameLoop = () => {}
  app.view.remove()
}

function startPlayers() {
  p1()
  p2()
  pvp()
  animStop()
}

function p1() {
  const p1 = new PIXI.Sprite.from('battle-stance/leftfacing/bowser.png')
  p1.x = window.innerWidth
  p1.y = 0
  app.stage.addChild(p1)

  new TWEEN.Tween(p1)
    .to({ x: centerX - 750 }, 700)
    .easing(TWEEN.Easing.Elastic.Out)
    .start()
}

function p2() {
  const p2 = new PIXI.Sprite.from('battle-stance/rightfacing/yoshi.png')
  p2.x = -850
  p2.y = 0
  app.stage.addChild(p2)

  new TWEEN.Tween(p2)
    .to({ x: centerX }, 500)
    .easing(TWEEN.Easing.Elastic.Out)
    .delay(700)
    .start()
}

function pvp() {
  const pvp = new PIXI.Sprite.from('player-versus-player.png')
  pvp.x = centerX - 82
  pvp.y = centerY - 82
  app.stage.addChild(pvp)
}

function blackrect() {
  const white = new PIXI.Graphics()
  white.alpha = 0
  white.beginFill(0xFFFFFF)
  white.drawRect(0, 0, window.innerWidth, window.innerHeight)
  app.stage.addChild(white)

  const black = new PIXI.Graphics()
  black.alpha = 0
  black.beginFill(0x000000)
  black.drawRect(0, 0, window.innerWidth, window.innerHeight)
  app.stage.addChild(black)

  const fadeToBlack = new TWEEN.Tween(black)
    .to({ alpha: 1 }, 200)
    .onComplete(startPlayers)

  const fadeToWhite = new TWEEN.Tween(white)
    .to({ alpha: 1 }, 200)
    .start()
    .chain(fadeToBlack)
}

function animStop() {
  new TWEEN.Tween(0)
    .to(1, 3000)
    .start()
    .onComplete(cleanup)
}

export default function startAnimation() {

  const config = {
    width: window.innerWidth + 20,
    height: window.innerHeight + 20,
    transparent: true
  }
  app = new PIXI.Application(config)
  app.view.style = "position: absolute; top: -10px; left: -10px;"

  app.stage.x = 10
  app.stage.y = 10
  
  document.body.appendChild(app.view)

  app.loader
    .add('battle-stance/leftfacing/bowser.png')
    .add('battle-stance/rightfacing/yoshi.png')
    .add('player-versus-player.png')
    .load(setupAnimation)  
}
