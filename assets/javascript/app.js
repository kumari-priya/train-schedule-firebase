// Global variables
var name;
var destination;
var frequency;
var firstTrainTime;
var nextArrival;
var minutesAway;
var getAllTrains = true;

// Initialize Firebase
var config = {
   apiKey: "AIzaSyCjXw15NeqKJvvLLJ0dfXfAXS0JZWCD078",
   authDomain: "train-schedule-442cc.firebaseapp.com",
   databaseURL: "https://train-schedule-442cc.firebaseio.com",
   projectId: "train-schedule-442cc",
   storageBucket: "",
   messagingSenderId: "466882555320"
 };
firebase.initializeApp(config);

var database = firebase.database();

// clearDatabase(database);

  // Show all train data from firebase when page loads
  database.ref().on("value", function(snapshot) {
      if (getAllTrains) {
          if (snapshot.val() !== null) {
              snapshot.forEach(function(child) {
                  var sv = child.val();
                  addTableRow(sv);
              });
          }
          // change the flag
          getAllTrains = false;
          console.log("in");
      }
  });



$("#add-btn").on("click", function(event) {

    event.preventDefault();

    var tName = $("#name");
    var tDestination = $("#destination");
    var tFrequency = $("#frequency");
    var tFirstTrainTime = $("#time");

    // Grab values from text boxes
    name = tName.val().trim();
    destination = tDestination.val().trim();
    frequency = tFrequency.val().trim();
    firstTrainTime = tFirstTrainTime.val().trim();
    // Push data
    pushData(database, name, destination, frequency, firstTrainTime);
    // Append table body
    appendTable(database);
    // Empty the input text
    tName.val("");
    tDestination.val("");
    tFrequency.val("");
    tFirstTrainTime.val("");

});



// Push data in the firebase
function pushData(db, name, destination, frequency, firstTrainTime) {
    db.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        firstTrainTime: firstTrainTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
}

// Append table body for every new train added
function appendTable(db) {
    db.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        console.log("append");
        var sv = snapshot.val();
        // Append the new added data to the html table
        addTableRow(sv);
    });
}

// Append a new row in html table
function addTableRow(trainData) {
    var tableBody = $("#train-table");
    var tableRow = $("<tr>");

    var tdName = $("<td>");
    var tdDestination = $("<td>");
    var tdFrequency = $("<td>");
    var tdNextArrival = $("<td>");
    var tdMinutesAway = $("<td>");

    tdName.text(trainData.name);
    tdDestination.text(trainData.destination);
    tdFrequency.text(trainData.frequency);
    minutesAway = calculateMinutesAway(trainData.firstTrainTime, trainData.frequency);
    nextArrival = calculateNextArrival(minutesAway);
    tdMinutesAway.text(minutesAway);
    tdNextArrival.text(nextArrival);

    tableRow.append(tdName);
    tableRow.append(tdDestination);
    tableRow.append(tdFrequency);
    tableRow.append(tdNextArrival);
    tableRow.append(tdMinutesAway);

    tableBody.prepend(tableRow);
}

function calculateMinutesAway(firstTrainTime, tFrequency) {
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    return tMinutesTillTrain;
}

function calculateNextArrival(tMinutesTillTrain) {
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    return moment(nextTrain).format("hh:mm A")
}

// Clear the database when needed
function clearDatabase(db) {
    var data = db.ref();
    data.remove();
}
