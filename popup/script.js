document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("replacement-submit").addEventListener("click", updateText);
    document.getElementById("clear-replacements").addEventListener("click", clearReplacements);
});



function updateText() {
    console.log('replace words')
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        let activeTab = tabs[0];
        msg = {
            d: "replace",
            original: document.getElementById("original-word").value,
            replacement: document.getElementById("replacement-word").value,
        }
        chrome.tabs.sendMessage(activeTab.id, msg);
    });
}

function clearReplacements(){
    // need to send message to content.js.
    console.log('clear replacements');
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        let activeTab = tabs[0];
        msg = {
            d: "clear"
        }
        chrome.tabs.sendMessage(activeTab.id, msg);
    });
}