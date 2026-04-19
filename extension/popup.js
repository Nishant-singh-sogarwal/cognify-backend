chrome.storage.local.get([
"studyTime",
"focusStreak",
"bestStreak",
"distractionCount"
],(data)=>{

let studyTime=data.studyTime || 0
let focusStreak=data.focusStreak || 0
let distractions=data.distractionCount || 0

let score=100-(distractions*10)
if(score<0) score=0

document.getElementById("focusScore").innerText=score+"%"
document.getElementById("studyTime").innerText=studyTime+" min"
document.getElementById("focusStreak").innerText=focusStreak+" min"
document.getElementById("distractions").innerText=distractions

})