let tabSwitchCount = 0
let lastSwitchTime = Date.now()

chrome.tabs.onActivated.addListener((activeInfo) => {

let now = Date.now()

let timeDiff = now - lastSwitchTime

lastSwitchTime = now

// if tab switched quickly (within 10 sec)

if(timeDiff < 10000){

tabSwitchCount++

console.log("Cognify: Tab switched quickly")

}

// reset counter every 2 minutes

setTimeout(()=>{

tabSwitchCount = 0

},120000)

// send message to content script

chrome.tabs.sendMessage(activeInfo.tabId,{

type:"TAB_SWITCH",
count:tabSwitchCount

})

})