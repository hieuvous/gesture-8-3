const video = document.getElementById("video")
const img = document.getElementById("mainImage")
const message = document.getElementById("message")

let images = [
"images/flower.png",
"images/photo1.jpg",
"images/photo2.jpg",
"images/photo3.jpg",
"images/photo4.jpg"
]

let index = 0

function nextImage(){

index++

if(index >= images.length){
index = 0
}

img.src = images[index]

}

function prevImage(){

index--

if(index < 0){
index = images.length - 1
}

img.src = images[index]

}

/* swipe detection */

let history = []
let lastSwipeTime = 0

function handleSwipe(x){

history.push(x)

if(history.length > 6){
history.shift()
}

let diff = x - history[0]

let now = Date.now()

if(Math.abs(diff) > 0.18 && now - lastSwipeTime > 800){

if(diff > 0){
nextImage()
}else{
prevImage()
}

lastSwipeTime = now
history = []

}

}

/* zoom (GIỮ NGUYÊN NHƯ CODE CỦA BẠN) */

function zoomImage(){

img.style.scale="1.5"

}

function resetZoom(){

img.style.scale="1"

}

/* love message */

let lastHeartTime = 0

function showLove(){

message.innerText="I LOVE YOU ❤️"

heartExplosion()

}

/* heart animation */

function heartExplosion(){

for(let i=0;i<30;i++){

let heart=document.createElement("div")

heart.innerHTML="❤️"

heart.style.position="absolute"
heart.style.left=Math.random()*100+"%"
heart.style.top=Math.random()*100+"%"
heart.style.fontSize="30px"

document.body.appendChild(heart)

setTimeout(()=>{

heart.remove()

},2000)

}

}

/* flower petals */

function createPetal(){

let petal=document.createElement("div")

petal.className="petal"

petal.innerHTML="🌸"

petal.style.left=Math.random()*100+"%"

petal.style.animationDuration=(Math.random()*5+3)+"s"

document.body.appendChild(petal)

setTimeout(()=>{

petal.remove()

},8000)

}

setInterval(createPetal,400)

/* mediapipe */

const hands=new Hands({

locateFile:(file)=>{

return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

}

})

hands.setOptions({

maxNumHands:1,
modelComplexity:1,
minDetectionConfidence:0.5,
minTrackingConfidence:0.5

})

function onResults(results){

if(!results.multiHandLandmarks || results.multiHandLandmarks.length===0){
return
}

const landmarks = results.multiHandLandmarks[0]

let x = landmarks[0].x

/* swipe */

handleSwipe(x)

/* fist */

let fist=

landmarks[8].y > landmarks[6].y &&
landmarks[12].y > landmarks[10].y &&
landmarks[16].y > landmarks[14].y &&
landmarks[20].y > landmarks[18].y

/* open */

let open=

landmarks[8].y < landmarks[6].y &&
landmarks[12].y < landmarks[10].y

if(fist){

zoomImage()

}

if(open){

resetZoom()

}

/* heart gesture */

let thumb = landmarks[4]
let indexFinger = landmarks[8]

let dx = thumb.x - indexFinger.x
let dy = thumb.y - indexFinger.y

let dist = Math.sqrt(dx*dx + dy*dy)

let now = Date.now()

if(dist < 0.05 && now - lastHeartTime > 1500){

showLove()

lastHeartTime = now

}

}

hands.onResults(onResults)

/* camera */

const camera=new Camera(video,{

onFrame:async()=>{

await hands.send({image:video})

},

width:640,
height:480

})

camera.start()