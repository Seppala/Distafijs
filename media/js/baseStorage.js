function whatIsYourCurrentStatus() {
  var status = window.prompt("What is your current status?");
  if (!status) return;
  if (navigator.onLine) {
    sendToServer(status);
  } else {
    saveStatusLocally(status);
  }
}
 
function sendLocalStatus() {
  var status = readStatus();
  if (status) {
    sendToServer(status);
    window.localStorage.removeItem("status");
  }
}
 
 
window.addEventListener("load", function() {
   if (navigator.onLine) {
     sendLocalStatus();
   }
}, true);
 
window.addEventListener("online", function() {
  sendLocalStatus();
}, true);
 
window.addEventListener("offline", function() {
  alert("You're now offline. If you update your status, it will be sent when you go back online");
}, true);