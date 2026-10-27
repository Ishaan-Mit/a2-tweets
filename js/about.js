// sets the text of every element that has this id OR this class
// (some spans, like the completed events count, appear more than once on the page)
function setText(name, value) {
	const byId = document.getElementById(name);
	if (byId) {
		byId.innerText = value;
	}
	const byClass = document.getElementsByClassName(name);
	for (const element of byClass) {
		element.innerText = value;
	}
}

// formats a part of a total as a percentage with exactly two decimals, like "95.23%"
function formatPercent(part, total) {
	if (total == 0) {
		return "0.00%";
	}
	return (part / total * 100).toFixed(2) + "%";
}

// formats a date like "Sunday, September 30, 2018"
function formatDate(date) {
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// total number of tweets
	document.getElementById('numberTweets').innerText = tweet_array.length;

	// earliest and latest dates
	const times = tweet_array.map(function(tweet) {
		return tweet.time.getTime();
	});
	setText("firstDate", formatDate(new Date(Math.min(...times))));
	setText("lastDate", formatDate(new Date(Math.max(...times))));

	// tweet categories
	const completed = tweet_array.filter(function(tweet) {
		return tweet.source == "completed_event";
	});
	const live = tweet_array.filter(function(tweet) {
		return tweet.source == "live_event";
	});
	const achievements = tweet_array.filter(function(tweet) {
		return tweet.source == "achievement";
	});
	const miscellaneous = tweet_array.filter(function(tweet) {
		return tweet.source == "miscellaneous";
	});

	const total = tweet_array.length;
	setText("completedEvents", completed.length);
	setText("completedEventsPct", formatPercent(completed.length, total));
	setText("liveEvents", live.length);
	setText("liveEventsPct", formatPercent(live.length, total));
	setText("achievements", achievements.length);
	setText("achievementsPct", formatPercent(achievements.length, total));
	setText("miscellaneous", miscellaneous.length);
	setText("miscellaneousPct", formatPercent(miscellaneous.length, total));

	// completed tweets that contain user-written text
	const written = completed.filter(function(tweet) {
		return tweet.written;
	});
	setText("written", written.length);
	setText("writtenPct", formatPercent(written.length, completed.length));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});