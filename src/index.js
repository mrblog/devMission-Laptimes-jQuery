import "./styles.css";
import $ from "jquery";

$(document).ready(function() {
  function listView() {
    listViewBase();
    $.each(window.trackData, function(trackId, fields) {
      addTrack(fields);
    });
  }
  function listViewBase() {
    $("main").html(`<section class="jumbotron text-center">
<div class="container">
  <h1 class="jumbotron-heading">Lap times example</h1>
  <p class="lead text-muted">Below is a list of race tracks I've driven on with some basic info, and a button 
  linking to the detail page for that track.</p>
</div>
</section>

<div class="album py-5 bg-light">
<div class="container">

  <div class="row" id="tracks">
 
  </div>
</div>
</div>
`);
  }
  function addTrack(fields) {
    console.log("adding track: " + fields.trackId);
    $("#tracks").append(
      `<div class="col-md-4">
<div class="card mb-4 shadow-sm">
  <img class="card-img-top" src="${
    fields.trackMap[0].url
  }" alt="Track image cap">
  <div class="card-body">
  <h5 class="card-title">${fields.trackName}</h5>
  <p class="card-text">${fields.description}</p>
    <div class="d-flex justify-content-between align-items-center">
      <div class="btn-group">
        <button type="button" class="btn btn-sm btn-outline-secondary trackView" 
        data-trackid="${fields.trackId}">View</button>
      </div>
      <small class="text-muted">${fields.trackLength} miles</small>
    </div>
  </div>
</div>
</div>`
    );
    $(".trackView").click(function() {
      var trackId = $(this).data("trackid");
      console.log("track clicked: " + trackId);
      console.log("name: " + window.trackData[trackId].trackName);
      viewTrack(window.trackData[trackId]);
    });
  }

  function fmtMSS(s) {
    s = Math.round(s);
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  }

  function viewTrack(fields) {
    var goalSpeed = (fields.trackLength / fields.goalLaptime) * 3600;
    var bestSpeed = (fields.trackLength / fields.bestLaptime) * 3600;
    var percent = (Math.round((bestSpeed / goalSpeed) * 100) / 100) * 100;
    console.log("goalSpeed: " + goalSpeed + " bestSpeed: " + bestSpeed);
    $("main").html(
      `<div class="container">
    <div class="row">
    <div class="col-md-4">
    <img src="${
      fields.trackMap[0].thumbnails.large.url
    }" alt="Track map" class="trackmap-detail">
    </div>
    <div class="details col-md-8">
    <h3>${fields.trackName}</h3>
    <h6 class="trackLength">Distance: <span>${
      fields.trackLength
    } miles </span></h6>
    <h6 class="bestLaptime">Best lap: <span>${fmtMSS(
      fields.bestLaptime
    )} </span></h6>
    <h6 class="goalLaptime">Goal lap: <span>${fmtMSS(
      fields.goalLaptime
    )}</span></h6>
    <div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="${percent}"
  aria-valuemin="0" aria-valuemax="100" style="width: ${percent}%">
    ${percent}%
  </div>
  
</div>
    </div>
    </div>
    <div class="row"> 
    <div class="details col-md-8">
  <p class="trackDescription">${fields.description}</p>
        <div class="officialSite"><a href="${
          fields.trackUrl
        }" target="_new">Official Track Site</a></div>
  </div>
  </div>
  <div class="row">
  <div class="details col-md-8">
  <button class="btn btn-primary home" type="button" id="homeButton">Back to Track list</button>
  </div>
  </div>
    </div>`
    );
    $("#homeButton").click(function() {
      listView();
    });
  }

  $("#home-button").click(function(e) {
    e.preventDefault();
    listView();
  });

  listViewBase();

  window.trackData = {};
  $.ajax(
    "https://api.airtable.com/v0/appeCYM4x8QCX1A4M/Laptimes?api_key=keyv4QDuZMfORAFjN",
    {
      dataType: "json",
      success: function(data) {
        console.log("records: " + data.records.length);
        $.each(data.records, function(i, row) {
          console.log(i + ": id: " + row.fields.trackId);
          if (row.fields.trackId) {
            window.trackData[row.fields.trackId] = row.fields;
            addTrack(row.fields);
          }
        });
      }
    }
  );
});
