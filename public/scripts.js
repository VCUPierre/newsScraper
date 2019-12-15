$(document).ready(function(){
    //alert("hello world");
    getStories();
})
$(document).on("click", ".btn-info",function(){
    scrape();
    document.location.reload();
})

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
        cardBodyBtn.text("Link to Full Story");
        cardBodyBtnHolder.append(cardBodyBtn);
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