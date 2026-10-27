const writtenTweets = []

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	tweet_array.forEach(function(tweet) {
		if (tweet.written) {
			writtenTweets.push(tweet);
		}
	});
}

function addEventHandlerForSearch() {
	const searchBox = document.getElementById("textFilter");

	// "input" fires after every character is added or removed
	searchBox.addEventListener("input", function() {
		const query = searchBox.value.toLowerCase();

		// empty search: clear the table and reset the spans
		if (query == "") {
			document.getElementById("tweetTable").innerHTML = "";
			document.getElementById("searchCount").innerText = 0;
			document.getElementById("searchText").innerText = "";
			return;
		}

		// keep only the written tweets whose text contains the query
		const matches = writtenTweets.filter(function(tweet) {
			return tweet.writtenText.toLowerCase().includes(query);
		});

		// one table row per match, numbered starting at 1
		const rows = matches.map(function(tweet, index) {
			return tweet.getHTMLTableRow(index + 1);
		});

		document.getElementById("tweetTable").innerHTML = rows.join("");
		document.getElementById("searchCount").innerText = matches.length;
		document.getElementById("searchText").innerText = searchBox.value;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});