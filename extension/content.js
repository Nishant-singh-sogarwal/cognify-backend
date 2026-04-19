console.log("Cognify content script loaded")

// ---------------- STATE VARIABLES ----------------

let studyTime = 0
let distractionCount = 0
let focusStreak = 0
let bestStreak = 0
let focusedMinutes = 0
let startTime = Date.now()

let distractionHistory = []
let focusSpans = []

let recoveryTimes = []
let lastDistractionTime = null

let reinforcementShown = false

// ---------------- KEYWORDS ----------------

const learningKeywords = [
"tutorial","course","lecture","lesson","class","explained","guide","how to","learn",
"training","algorithm","problem","solution","theory","practice","education",
"study","coding","programming","developer","javascript","python","java",
"react","node","data structures","system design","leetcode"
]

const musicKeywords = [
"lofi","study music","focus music","instrumental","ambient music","lofi beats"
]

const entertainmentKeywords = [
"vlog","funny","comedy","prank","reaction","gaming","minecraft","pubg",
"movie","trailer","song","music video","memes","shorts","drama","episode"
]

// ---------------- VIDEO ANALYSIS ----------------

function analyzeVideoTitle(){

const title = document.title.toLowerCase()

console.log("Cognify checking:", title)

if(entertainmentKeywords.some(k => title.includes(k))){

console.log("Cognify: Entertainment / distraction detected")

recordDistraction("Entertainment Video")

distractionCount++

focusSpans.push(focusStreak)

focusStreak = 0
reinforcementShown = false

lastDistractionTime = Date.now()

setTimeout(()=>{
showDistractionPopup()
},3000)

return
}

if(musicKeywords.some(k => title.includes(k))){
console.log("Cognify: Focus music detected")
return
}

if(learningKeywords.some(k => title.includes(k))){

if(lastDistractionTime!==null){

let recovery = Math.round((Date.now()-lastDistractionTime)/60000)

recoveryTimes.push(recovery)

console.log("Recovery Time:", recovery,"minutes")

lastDistractionTime = null

}

console.log("Cognify: Learning video detected")
return
}

console.log("Cognify: Neutral video")

}

// ---------------- RECORD DISTRACTION ----------------

function recordDistraction(type){

distractionHistory.push({
type:type,
time:new Date().toLocaleTimeString(),
afterFocus:focusStreak
})

}

// ---------------- DISTRACTION POPUP ----------------

function showDistractionPopup(){

if(document.getElementById("cognify-popup")) return

const popup=document.createElement("div")

popup.id="cognify-popup"

popup.style.position = "fixed"
popup.style.top = "20px"
popup.style.right = "20px"

popup.style.background = "#111"
popup.style.color = "white"

popup.style.padding = "18px 22px"
popup.style.borderRadius = "10px"

popup.style.fontSize = "16px"
popup.style.fontWeight = "500"

popup.style.boxShadow = "0 6px 18px rgba(0,0,0,0.4)"

popup.style.zIndex = "9999"
popup.style.width = "280px"
popup.style.lineHeight = "1.4"

popup.style.border = "1px solid #333"

popup.innerHTML=`
<h3>⚠ Distraction Detected</h3>
<p>You opened entertainment content.</p>
<button id="continueStudy">Return to Focus</button>
`

document.body.appendChild(popup)

document.getElementById("continueStudy").onclick=()=>{
popup.remove()
}

setTimeout(()=>popup.remove(),8000)

}

// ---------------- STUDY TIMER ----------------

setInterval(()=>{

let currentTime=Date.now()

studyTime=Math.floor((currentTime-startTime)/60000)

focusStreak++
focusedMinutes++

if(focusStreak>bestStreak){
bestStreak=focusStreak
}

showFocusMotivation()

reinforceFocus()

},60000)

// ---------------- MOTIVATION ----------------

function showFocusMotivation(){

if(focusStreak===10){
console.log("🔥 Great start! 10 minutes focus.")
}

if(focusStreak===25){
console.log("🔥 Entering Deep Work mode.")
}

if(focusStreak===45){
console.log("🚀 Extreme focus achieved.")
}

if(focusStreak===60){
console.log("🏆 MASTER FOCUS — 1 hour!")
}

}

// ---------------- ANALYTICS ----------------

function calculateAverageFocusSpan(){

if(focusSpans.length===0) return 0

let total=focusSpans.reduce((a,b)=>a+b,0)

return Math.round(total/focusSpans.length)

}

// ---------------- DISTRACTION RANKING ----------------

function getDistractionRanking(){

let map={}

distractionHistory.forEach(d=>{
map[d.type]=(map[d.type]||0)+1
})

let sorted = Object.entries(map).sort((a,b)=>b[1]-a[1])

return sorted.slice(0,3)

}

// ---------------- FOCUS EFFICIENCY ----------------

function calculateFocusEfficiency(){

if(studyTime===0) return 0

let efficiency = (focusedMinutes / studyTime) * 100

return Math.round(efficiency)

}

// ---------------- RECOVERY ANALYSIS ----------------

function averageRecoveryTime(){

if(recoveryTimes.length===0) return 0

let total = recoveryTimes.reduce((a,b)=>a+b,0)

return Math.round(total/recoveryTimes.length)

}

function recoveryQuality(){

let avg = averageRecoveryTime()

if(avg===0) return "No data"

if(avg<=3) return "Excellent recovery"

if(avg<=7) return "Good recovery"

return "Slow recovery"

}

// ---------------- FOCUS CONSISTENCY ----------------

function calculateFocusConsistency(){

if(focusSpans.length<2) return 100

let avg = calculateAverageFocusSpan()

let variance = focusSpans.reduce((sum,val)=>{
return sum + Math.pow(val-avg,2)
},0) / focusSpans.length

let consistency = Math.max(0,100 - Math.round(variance))

return consistency

}

// ---------------- FOCUS GROWTH ----------------

function focusGrowthTrend(){

if(focusSpans.length<3) return "Not enough data"

let first = focusSpans.slice(0,Math.floor(focusSpans.length/2))
let second = focusSpans.slice(Math.floor(focusSpans.length/2))

let avg1 = first.reduce((a,b)=>a+b,0)/first.length
let avg2 = second.reduce((a,b)=>a+b,0)/second.length

if(avg2>avg1) return "Focus improving"

if(avg2<avg1) return "Focus decreasing"

return "Focus stable"

}

// ---------------- FOCUS REINFORCEMENT ----------------

function reinforceFocus(){

let avg = calculateAverageFocusSpan()

if(avg===0) return

if(!reinforcementShown && focusStreak===avg-3){

console.log("⚡ Focus Challenge")

console.log("Your usual distraction point:",avg,"minutes")

console.log("Stay focused 5 more minutes to beat it!")

showChallengePopup(avg)

reinforcementShown=true

}

}

// ---------------- CHALLENGE POPUP ----------------

function showChallengePopup(avg){

if(document.getElementById("challenge-popup")) return

const popup=document.createElement("div")

popup.id="challenge-popup"

popup.style.position="fixed"
popup.style.bottom="60px"
popup.style.right="20px"
popup.style.background="#222"
popup.style.color="white"
popup.style.padding="16px"
popup.style.borderRadius="10px"
popup.style.zIndex="999999"

popup.innerHTML=`
🔥 Focus Challenge<br>
Your usual limit: ${avg} minutes<br>
Push for 5 more minutes!
`

document.body.appendChild(popup)

setTimeout(()=>popup.remove(),7000)

}

// ---------------- STATS ----------------

function showFocusStats(){

console.log("📊 Cognify Stats")

console.log("Study Time:",studyTime,"minutes")

console.log("Focus Streak:",focusStreak,"minutes")

console.log("Best Streak:",bestStreak,"minutes")

console.log("Average Focus Span:",calculateAverageFocusSpan(),"minutes")

console.log("Focus Consistency:",calculateFocusConsistency()+"%")

console.log("Focus Trend:",focusGrowthTrend())

console.log("Focus Efficiency:",calculateFocusEfficiency()+"%")

console.log("Average Recovery Time:",averageRecoveryTime(),"minutes")

console.log("Recovery Quality:",recoveryQuality())

console.log("Top Distractions:",getDistractionRanking())

console.log("Distraction History:",distractionHistory)

}

setInterval(()=>showFocusStats(),120000)

// ---------------- YOUTUBE NAVIGATION FIX ----------------

let lastUrl=location.href

setInterval(()=>{

if(location.href!==lastUrl){

lastUrl=location.href

setTimeout(()=>analyzeVideoTitle(),2000)

}

},1000)

setTimeout(analyzeVideoTitle,2000)