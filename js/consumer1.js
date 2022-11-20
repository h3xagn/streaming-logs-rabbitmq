var wsbroker = "localhost"; // mqtt websocket enabled broker
var wsport = 15675; // port for above
var client = new Paho.MQTT.Client(
    wsbroker,
    wsport,
    "/ws",
    "myclientid_" + parseInt(Math.random() * 100, 10)
);

client.onConnectionLost = function (responseObject) {
    console.log("CONNECTION LOST - " + responseObject.errorMessage);
};

client.onMessageArrived = function (message) {
    var log = JSON.parse(message.payloadString);
    var table = document.getElementById("log_table");

    var row = document.createElement("tr");
    row.setAttribute("class", "bg-gray-700 border-gray-500 border-b");
    table.appendChild(row);

    var text_colour = "text-gray-300";

    if (log["levelname"] == "INFO") {
        text_colour = "text-blue-300";
    }
    else if (log["levelname"] == "WARNING") {
        text_colour = "text-orange-300";
    }
    else if (log["levelname"] == "ERROR") {
        text_colour = "text-red-300";
    }

    var cell = document.createElement("td");
    cell.setAttribute("class", "text-sm " + text_colour + " font-normal px-6 py-2 whitespace-nowrap");
    row.appendChild(cell);
    cell.innerText = log["host"];

    var cell = document.createElement("td");
    cell.setAttribute("class", "text-sm " + text_colour + " font-normal px-6 py-2 whitespace-nowrap");
    row.appendChild(cell);
    cell.innerText = log["source"];

    var cell = document.createElement("td");
    cell.setAttribute("class", "text-sm " + text_colour + " font-normal px-6 py-2 whitespace-nowrap");
    row.appendChild(cell);
    cell.innerText = log["filename"];

    var cell = document.createElement("td");
    cell.setAttribute("class", "text-sm " + text_colour + " font-normal px-6 py-2 whitespace-nowrap");
    row.appendChild(cell);
    cell.innerText = log["module"];

    var cell = document.createElement("td");
    cell.setAttribute("class", "text-sm " + text_colour + " font-normal px-6 py-2 whitespace-nowrap");
    row.appendChild(cell);
    const dateObject = new Date(log["created"] * 1000);
    const humanDateFormat = dateObject.toLocaleString();
    cell.innerText = humanDateFormat;

    var cell = document.createElement("td");
    if (log["levelname"] == "DEBUG") {
        cell.setAttribute("class", "text-sm " + text_colour + " font-normal px-6 py-2 whitespace-nowrap");
    }
    else {
        cell.setAttribute("class", "text-sm " + text_colour + " font-normal px-6 py-2 whitespace-nowrap");
    }

    row.appendChild(cell);
    cell.innerText = log["levelname"];

    var cell = document.createElement("td");
    cell.setAttribute("class", "text-sm " + text_colour + " font-normal px-6 py-2 whitespace-nowrap text-left");
    row.appendChild(cell);
    cell.innerText = log["msg"];

    if (document.getElementById("check-auto-scroll").checked == true) {
        cell.scrollIntoView();
    };
};

var options = {
    timeout: 3,
    keepAliveInterval: 30,
    onSuccess: function () {
        console.log("CONNECTION SUCCESS");

        client.subscribe("app1.ERROR", { qos: 1 });

        client.subscribe("app2.ERROR", { qos: 1 });

        client.subscribe("app3.DEBUG", { qos: 1 });
        client.subscribe("app3.INFO", { qos: 1 });
        client.subscribe("app3.WARNING", { qos: 1 });
        client.subscribe("app3.ERROR", { qos: 1 });
    },
    onFailure: function (message) {
        console.log("CONNECTION FAILURE - " + message.errorMessage);
    },
};

if (location.protocol == "https:") {
    options.us
    eSSL = true;
}
console.log("CONNECT TO " + wsbroker + ":" + wsport);
client.connect(options);