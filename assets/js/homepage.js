var languageButtonsEl = document.querySelector("#language-buttons");
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);

        //clear old content
        repoContainerEl.textContent = "";
        nameInputEl.value ="";
    } else {
        alert("Please eneter a GitHub username");
    }
};

var buttonClickHandler = function(event) {
    //get the language attribute from the clicked element
    var language = event.target.getAttribute("data-language");
    console.log(language);

    // call the getFeaturedRepos() function and pass the value we just retrieved from data-language as the argument
    if (language) {
        getFeaturedRepos(language);

        // clear old content
        // even though this line comes after, it will always execute first because getFeaturedRepos() is asynchronous and will take longer to get a response from GitHub's API
        repoContainerEl.textContent = "";
        
    }

};

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = " No repositories found.";
        return;
    }
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // use query parameters to pass a repo name to the html page.
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }
    console.log(repos);
    console.log(searchTerm);
};

var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            //request was successful
            if (response.ok) {
                console.log(response);
                response.json().then(function(data){
                    console.log(data);
                    displayRepos(data, user);
                });
            } else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function(error) {
            //  Notice this '.catch()' getting chained onto the end of the '.then()' method
            alert("Unable to connect to GitHub");
        });
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        }
        else {
            alert("Error: GitHub User Not Found");
        }
    });
};

// add event listeners to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);