$(document).ready(function(){
    //alert("hello world");
    getStories();
})
$(document).on("click", ".btn-info",function(){
    scrape();
    document.location.reload();
});
// Whenever someone clicks a p tag
$(document).on("click", ".btn-secondary", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

const makeAccordian = (data) => {
    let accordionHolder = $("#accordion");
    accordionHolder.empty();
    data.forEach((element, i) => {
        let cardDiv = $('<div>', {class: "card", "data-id": data[i]._id});
        let cardHeader = $('<div>', {class: "card-header"});
        let headerH2 = $("<h2>", {class: "mb-0"});
        let headerBtn = $("<button>", {class: "btn btn-link", type: "button", "data-toggle": "collapse", "data-target": "#collapse"+i , "aria-expanded": "true", "aria-controls": "collapse"+i});
        headerBtn.text(data[i].headline);
        headerH2.append(headerBtn);
        cardHeader.append(headerH2);
        let collapseDiv = $("<div>", {id: "collapse"+i, class: "collapse", "aria-labelledby": data[i]._id, "data-parent": "#accordion"});
        let cardBody = $("<div>", {class: "card-body"});
        cardBody.text(data[i].summary);
        let cardBodyBtnHolder = $("<div>", {class: "text-center pb-4"});
        let cardBodyBtn = $("<a>", {href: data[i].url, class: "btn btn-primary", target: "_blank", rel: "noopener noreferrer"});
        let commentBtn = $("<a>", {href: data[i].url, class: "mt-2 btn btn-secondary"});
        let br = $("<br>");
        commentBtn.text("Add Comment");
        cardBodyBtn.text("Link to Full Story");
        cardBodyBtnHolder.append(cardBodyBtn,br,commentBtn);
        collapseDiv.append(cardBody, cardBodyBtnHolder);
        cardDiv.append(cardHeader, collapseDiv);
        cardDiv.appendTo(accordionHolder);
    });
    
}

function getStories(){
    $.getJSON("/stories").done(function(data){
        if (data.length === 0){
            scrape();
        } else {
            console.log(data);
            makeAccordian(data);
        }
    });
};

function scrape(){
    $.getJSON("/scrape").done(function(){
        console.log("New scrape");
        getStories();
    });
}