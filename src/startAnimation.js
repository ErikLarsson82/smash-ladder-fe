import * as PIXI from 'pixi.js'
import * as TWEEN from 'tween.js'
import { slug } from './helpers'

let app, player1, player2, stop, centerX, centerY, characterWidth, characterHeight, fontSizePlayer, fontSizeChar, mobile

function setupAnimation() {
  centerX = Math.round(window.innerWidth / 2)
  centerY = Math.round(window.innerHeight / 2)
  mobile = window.innerWidth < 1000
  characterWidth = mobile ? 450 : 750
  characterHeight = mobile ? 450 : 750
  fontSizePlayer = mobile ? 40 : 100
  fontSizeChar = mobile ? 30 : 60
  stop = false
  blackrect()
  gameLoop()
}

function gameLoop(time) {
  if (stop) return
  requestAnimationFrame(gameLoop)
  TWEEN.update(time)
}

function cleanup() {
  stop = true
  app.view.remove()
}

function text(name, character, color, positions) {
  const isBugChungus = name === 'Alexander'
  const size = isBugChungus && !mobile ? 70 : fontSizePlayer
  const player = new PIXI.Text(name, { fontSize: `${size}px`, font: 'Montserrat', fill: '#ffffff', align: 'left' })
  player.x = positions.playerX
  player.y = positions.playerY
  player.alpha = 0
  app.stage.addChild(player)

  const ass = new PIXI.Text('som', { fontSize: '30px', font: 'Montserrat', fill: '#ffffff', align: 'left' })
  ass.x = positions.assX
  ass.y = positions.assY
  ass.alpha = 0
  app.stage.addChild(ass)

  const char = new PIXI.Text(character, { fontStyle: 'italic', fontSize: `${fontSizeChar}px`, font: 'Montserrat', fill: color, align: 'left' })
  char.x = positions.charX
  char.y = positions.charY
  char.alpha = 0
  app.stage.addChild(char)

  new TWEEN.Tween(player)
    .to({ alpha: 1 }, 300)
    .delay(500)
    .start()

  new TWEEN.Tween(ass)
    .to({ alpha: 1 }, 300)
    .delay(500)
    .start()

  new TWEEN.Tween(char)
    .to({ alpha: 1 }, 300)
    .delay(500)
    .start()
}

function p1() {
  const positions = {
    playerX: centerX - 400,
    playerY: centerY + 200,
    assX: centerX - 420,
    assY: centerY + 304,
    charX: centerX - 400,
    charY: centerY + 340
  }
  text(player1.name.split(' ')[0], player1.main, '#ff0000', positions)
  const p1 = new PIXI.Sprite.from(`battle-stance/rightfacing/${slug(player1.main)}.png`)
  p1.x = window.innerWidth
  p1.y = 0
  p1.width = characterWidth
  p1.height = characterHeight

  app.stage.addChild(p1)

  new TWEEN.Tween(p1)
    .to({ x: centerX - characterWidth }, 700)
    .easing(TWEEN.Easing.Elastic.Out)
    .start()
    .onComplete(pvp)
}

function p2() {
  const positions = {
    playerX: centerX + 160,
    playerY: centerY + 200,
    assX: centerX + 140,
    assY: centerY + 304,
    charX: centerX + 160,
    charY: centerY + 340
  }
  text(player2.name.split(' ')[0], player2.main, '#0000ff', positions)
  const p2 = new PIXI.Sprite.from(`battle-stance/leftfacing/${slug(player2.main)}.png`)
  p2.x = -850
  p2.y = 0
  p2.width = characterWidth
  p2.height = characterHeight
  app.stage.addChild(p2)

  new TWEEN.Tween(p2)
    .to({ x: centerX }, 500)
    .easing(TWEEN.Easing.Elastic.Out)
    .start()
    .onComplete(delayThree)
}

function pvp() {
  const pvp = new PIXI.Sprite.from('player-versus-player.png')
  pvp.x = centerX
  pvp.y = centerY + 250
  pvp.anchor.set(0.5, 0.5)
  pvp.width = 0
  pvp.height = 0
  app.stage.addChild(pvp)

  new TWEEN.Tween(pvp)
    .to({ width: 82, height: 82 }, 300)
    .easing(TWEEN.Easing.Bounce.Out)
    .start()
    .onComplete(() => {
      p2()
      embers()
    }) 
}

function embers() {
  new Array(20).fill().forEach(ember)
}

function ember() {
  const _ember = new PIXI.Sprite.from('ember.png')
  _ember.x = centerX
  _ember.y = centerY + 250
  _ember.anchor.set(0.5, 0.5)
  _ember.width = 0
  _ember.height = 0
  _ember.alpha = 0
  app.stage.addChild(_ember)

  const destination = -300 + Math.random() * 600
  const d = Math.random() * 1000

  if (Math.random() > 0.5) {
    new TWEEN.Tween(_ember)
      .to({ x: centerX + destination }, 500 + (Math.random() * 400))
      .easing(TWEEN.Easing.Quadratic.InOut)
      .delay(d)
      .start()

    const up = 
      new TWEEN.Tween(_ember)
        .to({ y: -100 }, 4500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        
    new TWEEN.Tween(_ember)
      .to({ y: centerY + (Math.random() * 200) + 250 }, 900)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
      .delay(d)
      .chain(up)
    
  } else {
    new TWEEN.Tween(_ember)
        .to({ x: centerX + destination}, 500 + (Math.random() * 400))
        .easing(TWEEN.Easing.Quadratic.Out)
        .delay(d)
        .start()

    new TWEEN.Tween(_ember)
        .to({ y: -100 - (Math.random() * 500) }, 3500 + (Math.random() * 4000))
        .delay(d)
        .start()
  }

  new TWEEN.Tween(_ember)
    .to({ width: 8, height: 8 }, 100)
    .start()

  const fadeOut = new TWEEN.Tween(_ember)
    .to({ alpha: 0 }, 1500 + (Math.random() * 1500))
    .start()

  new TWEEN.Tween(_ember)
    .to({ alpha: 1 }, 1)
    .delay(d)
    .start()
    .chain(fadeOut)
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
    .onComplete(p1)

  new TWEEN.Tween(white)
    .to({ alpha: 1 }, 200)
    .start()
    .chain(fadeToBlack)
}

function delayThree() {
  new TWEEN.Tween(0)
    .to(1, 3000)
    .start()
    .onComplete(cleanup)
}

export default function startAnimation(_p1, _p2) {

  player1 = _p1
  player2 = _p2

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
    .add(`battle-stance/rightfacing/${slug(player1.main)}.png`)
    .add(`battle-stance/leftfacing/${slug(player2.main)}.png`)
    .add('player-versus-player.png')
    .add('ember.png')
    .load(setupAnimation)  
}
