import html2canvas from 'html2canvas'

let ctx
let snap
let cord = { x: 0 }
let last

function isHighDensity(){
  return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
}

function isRetina(){
  return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}

function animate(time) {
  if (last) {
    const diff = time - last
    last = time
    console.log(time, diff)
    requestAnimationFrame(animate)
    //TWEEN.update(time)
    cord.x = cord.x + (diff / 4)
    render()
  } else {
    last = time
    requestAnimationFrame(animate)
  }
}

export default function animation() {
  console.log(isRetina(), isHighDensity(), window.devicePixelRatio)

  html2canvas(document.querySelector('body'))
    .then(_snap => {
        snap = _snap
        const canvas = document.createElement('canvas')
        canvas.setAttribute('style', 'border: 1px solid black; position: absolute; top: 0; left: 0')
        canvas.setAttribute('width', '1000')
        canvas.setAttribute('height', '739')
        document.body.appendChild(canvas)

        ctx = canvas.getContext('2d')

        animate()
        //ctx.drawImage(snap, 0, 0)
    })
}

function render() {
  const zoom = window.devicePixelRatio

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 1000, 1000)

  const diff = Math.round(cord.x)

  ctx.fillStyle = '#f00'
  ctx.save()
  ctx.translate(0 - diff, 0 - diff)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(270, 0)
  ctx.lineTo(350, 540)
  ctx.lineTo(0, 610)
  ctx.closePath()
  ctx.fill()
  ctx.clip()
  ctx.scale(1 / zoom, 1 / zoom)
  ctx.drawImage(snap, 0, 0)
  ctx.restore()

  ctx.fillStyle = '#0f0'
  ctx.save()
  ctx.translate(0 + diff, 0 - diff)
  ctx.beginPath()
  ctx.moveTo(270, 0)
  ctx.lineTo(1000, 0)
  ctx.lineTo(1000, 405)
  ctx.lineTo(350, 540)
  ctx.closePath()
  ctx.fill()
  ctx.clip()
  ctx.scale(1 / zoom, 1 / zoom)
  ctx.drawImage(snap, 0, 0)
  ctx.restore()

  ctx.fillStyle = '#00f'
  ctx.save()
  ctx.translate(0 - diff, 0 + diff)
  ctx.beginPath()
  ctx.moveTo(0, 610)
  ctx.lineTo(350, 540)
  ctx.lineTo(420, 1000)
  ctx.lineTo(0, 1000)
  ctx.closePath()
  ctx.fill()
  ctx.clip()
  ctx.scale(1 / zoom, 1 / zoom)
  ctx.drawImage(snap, 0, 0)
  ctx.restore()

  ctx.fillStyle = '#0ff'
  ctx.save()
  ctx.translate(0 + diff, 0 + diff)
  ctx.beginPath()
  ctx.moveTo(420, 1000)
  ctx.lineTo(350, 540)
  ctx.lineTo(1000, 405)
  ctx.lineTo(1000, 1000)
  ctx.closePath()
  ctx.fill()
  ctx.clip()
  ctx.scale(1 / zoom, 1 / zoom)
  ctx.drawImage(snap, 0, 0)
  ctx.restore()
}

/*
function startRender() {
  document.getElementById('text1').innerHTML = ''
  document.getElementById('text2').innerHTML = ''
  document.getElementById('text3').innerHTML = ''
  document.getElementById('text4').innerHTML = ''


  new TWEEN.Tween(cord)
    .to({ x: 20 }, 700)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onComplete(() => {

        new TWEEN.Tween(cord)
          .to({ x: 600 }, 100)
          .easing(TWEEN.Easing.Quadratic.In)
          .onComplete(() => {

            })
          .start()
      })
    .start()

  requestAnimationFrame(animate)
}

function animate(time) {
    requestAnimationFrame(animate)
    TWEEN.update(time)
    render()
}

function renderCross() {
  html2canvas(document.querySelector('body')).then(c => { snap = c; startRender() })
}
*/
