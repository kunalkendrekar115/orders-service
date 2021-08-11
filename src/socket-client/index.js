function myFunction() {
  let socket = new WebSocket("ws://localhost:9000");
  const h1 = document.getElementById("demo");

  socket.onopen = function (e) {
    h1.textContent = "Connection established";
  };

  socket.onmessage = function (event) {
    console.log(event.data);
    h1.textContent = event.data;
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log("[close] Connection died");
    }
  };

  socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
    h1.textContent = error.toString();
  };
}
myFunction();
