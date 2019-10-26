import "./styles.css";

$(document).ready(function() {
  function listView() {
    $("main").html(`<section class="jumbotron text-center">
<div class="container">
  <h1 class="jumbotron-heading">Lap times example</h1>
  <p class="lead text-muted">Below is a list of race tracks with some basic info, and a button 
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
    $.each(window.trackData, addTrack);
  }
  function addTrack(fields) {
    console.log("adding track: " + fields.trackId);
    $("#tracks").append(
      `<div class="col-md-4">
<div class="card mb-4 shadow-sm">
  <img class="card-img-top" src="` +
        fields.trackMap[0].url +
        `" alt="Track image cap">
  <div class="card-body">
  <h5 class="card-title">` +
        fields.trackName +
        `</h5>
  <p class="card-text">` +
        fields.description +
        `</p>
    <div class="d-flex justify-content-between align-items-center">
      <div class="btn-group">
        <button type="button" class="btn btn-sm btn-outline-secondary trackView" data-trackid="` +
        fields.trackId +
        `">View</button>
      </div>
      <small class="text-muted">9 mins</small>
    </div>
  </div>
</div>
</div>`
    );
    $(".trackView").click(function() {
      var trackId = $(this).data("trackid");
      console.log("track clicked: " + trackId);
      console.log("name: " + window.trackData[trackId].trackName);
    });
  }

  window.trackData = [];
  $.ajax(
    "https://api.airtable.com/v0/appeCYM4x8QCX1A4M/Laptimes?api_key=keyv4QDuZMfORAFjN",
    {
      dataType: "json",
      success: function(data) {
        console.log("records: " + data.records.length);
        for (var i = 0; i < data.records.length; i++) {
          var row = data.records[i];
          console.log(i + ": id: " + row.fields.trackId);
          if (row.fields.trackId) {
            window.trackData[row.fields.trackId] = row.fields;
            addTrack(row.fields);
          }
        }
      }
    }
  );
  listView();
});
