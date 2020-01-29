$(document).ready(function(){
    //alert("hello world");
    getStories();
})
$(document).on("click", ".btn-info",function(){
    scrape();
    document.location.reload();
});

//on click of comment btn
$(document).on("click", ".btn-secondary", function() {
    // Empty the notes from the note section
    
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/stories/" + thisId
    }).then(function(data) {
        console.log("data",data);
        // The title of the article
        $("#noteTitle").empty();
        $("#noteTitle").append("<h2>" + data.headline + "</h2>");
        // An input to enter a new title
        $("#commentTitle").empty();
        $("#commentTitle").append("<h4>Comment Title</h4>","<input id='titleinput' name='title' class='form-control' >");
        // A textarea to add a new note body
        $("#commentInput").empty();
        $("#commentInput").append("<h4>Comment</h4>","<textarea id='bodyinput' name='body' class='form-control' rows='3'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#commentBtn").empty();
        $("#commentBtn").append("<button class='btn btn-primary mt-2' data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.comment) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.comment.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.comment.body);
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
      url: "/stories/" + thisId,
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
        console.log("commentData",data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#commentTitle").val("");
    $("#commentInput").val("");
  });

const makeAccordian = (data) => {
    let accordionHolder = $("#accordion");
    accordionHolder.empty();
    data.forEach((element, i) => {
        let cardDiv = $('<div>', {class: "card"});
        let cardHeader = $('<div>', {class: "card-header"});
        let headerH2 = $("<h2>", {class: "mb-0"});
        let headerBtn = $("<button>", {"data-id": data[i]._id, class: "btn btn-link", type: "button", "data-toggle": "collapse", "data-target": "#collapse"+i , "aria-expanded": "true", "aria-controls": "collapse"+i});
        headerBtn.text(data[i].headline);
        headerH2.append(headerBtn);
        cardHeader.append(headerH2);
        let collapseDiv = $("<div>", {id: "collapse"+i, class: "collapse", "aria-labelledby": data[i]._id, "data-parent": "#accordion"});
        let cardBody = $("<div>", {class: "card-body"});
        cardBody.text(data[i].summary);
        let cardBodyBtnHolder = $("<div>", {class: "text-center pb-4"});
        let cardBodyBtn = $("<a>", {href: data[i].url, class: "btn btn-primary", target: "_blank", rel: "noopener noreferrer"});
        let commentBtn = $("<a>", {"data-id": data[i]._id, class: "mt-2 btn btn-secondary", "data-toggle": "modal", "data-target": "#exampleModal"});
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