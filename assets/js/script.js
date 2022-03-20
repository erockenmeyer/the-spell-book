var formEl = document.querySelector("#spell-search");
var searchTypeEl = document.querySelector("#dropdown-menu2");
var spellTypeEl = document.querySelector("#username");
var historyEl = document.querySelector("#search-history");
var searchListEl = document.querySelector("#search-list");
var searchHistory = [];
var searchCounter = 0;

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get type from input
    // var keyword = spellTypeEl.value.trim();
    var searchType = searchTypeEl.value();

    if (keyword && searchType) {
        var historyObj = {
            type: searchType,
            keyword: keyword
        };
        displayHistory(historyObj);
        getSpellList(searchType, keyword);
    }

    console.log(searchType);
}

var getSpellList = function(type, keyword) {

    // checks for multiple types
    if (type === "level" || type === "school") {
        // format api url
        var apiUrl = "https://www.dnd5eapi.co/api/spells?" + type + "=" + keyword;
    } else {
        // turns key into array
        var splitKey = keyword.split(" ");
        var levels = [];
        var schools = [];

        // checks each variable in the array and assigns to either levels or schools arrays
        for (var i = 0; i < keyword.length; i++) {
            var char = splitKey[i];
            if (parseInt(char)) {
                levels.push(char);
            } else {
                schools.push(char);
            }
        }

        // turns both arrays into strings
        var lvlString = levels.join(",");
        var schoolString = schools.join(",");

        var apiUrl = "https://www.dnd5eapi.co/api/spells?level=" + lvlString + "&school=" + schoolString;
    }

    // make request to url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayList(data);
            })
        } else {
            console.log("Something went wrong!");
        }
    })
}

function displayList(data) {
    // assign list to variable
    var spellList = data.results;

    // check that there are results
    if (spellList.length === 0) {
        searchListEl.textContent = "No spells found!"
        return;
    }

    // clear any old content
    searchListEl.textContent = "";

    // create container in search list div
    var listContainer = document.createElement("ul");

    // iterate through list
    for (var i = 0; i < spellList.length; i++) {
        var name = spellList[i].name;
        var url = spellList[i].index;

        // make list els to contain spell info
        var listEl = document.createElement("li");
        var urlEl = document.createElement("a");
        urlEl.setAttribute("href", "./spell-finder.html?spell=" + url);
        urlEl.textContent = name;

        // append to container
        listEl.appendChild(urlEl);
        listContainer.appendChild(listEl);
    }
    console.log(spellList[0]);

    // append container to dom
    searchListEl.appendChild(listContainer);
}

var displayHistory = function(historyObj) {
    var historyItemEl = document.createElement("li");

    // add counter as custom attribute
    historyItemEl.setAttribute("data-search-id", searchCounter);

    // display type and search word
    historyItemEl.innerHTML = "<span>" + historyObj.type + "</span> <span>" + historyObj.keyword + "</span>";

    historyObj.id = searchCounter;
    searchHistory.push(historyObj);
    saveSearch();

    historyEl.appendChild(historyItemEl);

    // increase count
    searchCounter++;
}

// saves history to local
var saveSearch = function() {
    localStorage.setItem("search history", JSON.stringify(searchHistory));
}

var loadHistory = function() {
    var history = localStorage.getItem("search history");
    if (!history) {
        return false;
    }

    // convert to array & display
    history = JSON.parse(history);
    for (var i = 0; i < history.length; i++) {
        displayHistory(history);
    }
}

getSpellList("level", "2");

formEl.addEventListener("submit", formSubmitHandler);
loadHistory();