  // Initialize Firebase
  var config = {
  apiKey: "AIzaSyD4syou7Jr1SRGCxNvCcbjQXLugTPmGZUA",
  authDomain: "rcp-game.firebaseapp.com",
  databaseURL: "https://rcp-game.firebaseio.com",
  projectId: "rcp-game",
  storageBucket: "rcp-game.appspot.com",
  messagingSenderId: "451138795484"
  };
firebase.initializeApp(config);

var database = firebase.database();

var name;
var destination;
var frequency;
var firstTrainTime;
var nextArrival;
var minutesAway;

$("#add-btn").on("click", function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  name = $("#name").val().trim();
  destination = $("#destination").val().trim();
  frequency = $("#frequency").val().trim();
  firstTrainTime = $("#time").val().trim();
  nextArrival = calculateNextArrival(firstTrainTime,frequency);
  minutesAway = calculateMinutesAway(firstTrainTime,frequency);

  // Code for handling the push
  database.ref().push({
    name: name,
    destination: destination,
    frequency: frequency,
    firstTrainTime: firstTrainTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

// Empty the input text
  $("#name").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#time").val("");

});

var data = database.ref();
data.remove();


database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();
  var tableBody = $("#train-table");
  var tableRow = $("<tr>");

  var tdName = $("<td>");
  var tdDestination = $("<td>");
  var tdFirstStartTime = $("<td>");
  var tdFrequency = $("<td>");
  var tdNextArrival = $("<td>");
  var tdMinutesAway = $("<td>");


  tdName.text(snapshot.val().name);
  tdDestination.text(snapshot.val().destination);
  tdFirstStartTime.text(snapshot.val().firstTrainTime);
  tdFrequency.text(snapshot.val().frequency);
  tdNextArrival.text(calculateNextArrival(snapshot.val().firstTrainTime,snapshot.val().frequency));
  tdMinutesAway.text(calculateMinutesAway(snapshot.val().firstTrainTime,snapshot.val().frequency));

  tableRow.prepend(tdMinutesAway);
  tableRow.prepend(tdNextArrival);
  tableRow.prepend(tdFirstStartTime);
  tableRow.prepend(tdFrequency);
  tableRow.prepend(tdDestination);
  tableRow.prepend(tdName);

  tableBody.prepend(tableRow);

});

function calculateNextArrival(firstTrainTime,frequency) {
  //return Math.floor(moment().diff(moment(startDate), 'months', true));
  return 0;
}

function calculateMinutesAway(firstTrainTime,frequency)  {
 //return Math.floor(moment(firstTrainTime, "HH:mm").fromNow());
 return 0;
}
