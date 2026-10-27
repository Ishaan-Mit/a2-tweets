function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	const completed = tweet_array.filter(function(tweet) {
		return tweet.source == "completed_event" && tweet.activityType != "unknown";
	});

	const counts = completed.reduce(function(totals, tweets) {
		totals[tweets.activityType] = (totals[tweets.activityType] || 0) + 1;
		return totals;
	}, {});

	const activityCounts = Object.keys(counts).map(function(type) {
		return {activity: type, count: counts[type]};
	}).sort(function(a, b) {
		return b.count - a.count;
	});

	document.getElementById("numberActivities").innerText = activityCounts.length;
	document.getElementById("firstMost").innerText = activityCounts[0].activity;
	document.getElementById("secondMost").innerText = activityCounts[1].activity;
	document.getElementById("thirdMost").innerText = activityCounts[2].activity;
	
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": activityCounts
		},
		"mark": "bar",
		"encoding": {
			"x": {"field": "activity", "type": "nominal", "sort": "-y", "title": "Activity type"},
			"y": {"field": "count", "type": "quantitative", "title": "Number of tweets"}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const topThree = activityCounts.slice(0, 3).map(function(item) {
		return item.activity;
	});
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const distanceData = completed.filter(function(tweet) {
		return topThree.includes(tweet.activityType) && tweet.distance > 0;
	}).map(function(tweet) {
		return {
			activity: tweet.activityType,
			day: dayNames[tweet.time.getDay()],
			distance: tweet.distance
		};
	});

	//every individual tweet
	const distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance by day of the week for the three most tweeted activities.",
	  "data": {"values": distanceData},
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "nominal", "sort": dayNames, "title": "Day of the week"},
	    "y": {"field": "distance", "type": "quantitative", "title": "Distance (mi)"},
	    "color": {"field": "activity", "type": "nominal", "title": "Activity type"}
	  }
	};

	// the mean distance for each day and activity
	const distance_mean_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance by day of the week for the three most tweeted activities.",
	  "data": {"values": distanceData},
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "nominal", "sort": dayNames, "title": "Day of the week"},
	    "y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean distance (mi)"},
	    "color": {"field": "activity", "type": "nominal", "title": "Activity type"}
	  }
	};

	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', distance_mean_vis_spec, {actions:false});

	// start with the aggregated plot hidden
	document.getElementById("distanceVisAggregated").style.display = "none";

	// the "aggregate" button swaps which plot is showing
	document.getElementById("aggregate").addEventListener("click", function() {
		const allPoints = document.getElementById("distanceVis");
		const means = document.getElementById("distanceVisAggregated");
		const showingAll = allPoints.style.display != "none";

		allPoints.style.display = showingAll ? "none" : "block";
		means.style.display = showingAll ? "block" : "none";
		document.getElementById("aggregate").innerText = showingAll ? "Show all activities" : "Show means";
	});

	// ----- longest and shortest activity types (by mean distance) -----
	const averages = topThree.map(function(type) {
		const distances = distanceData.filter(function(item) {
			return item.activity == type;
		}).map(function(item) {
			return item.distance;
		});
		return {activity: type, average: mean(distances)};
	}).sort(function(a, b) {
		return b.average - a.average;
	});

	document.getElementById("longestActivityType").innerText = averages[0].activity;
	document.getElementById("shortestActivityType").innerText = averages[averages.length - 1].activity;

	// ----- weekdays vs weekends -----
	const isWeekend = function(item) {
		return item.day == "Saturday" || item.day == "Sunday";
	};
	const weekendDistances = distanceData.filter(isWeekend).map(function(item) {
		return item.distance;
	});
	const weekdayDistances = distanceData.filter(function(item) {
		return !isWeekend(item);
	}).map(function(item) {
		return item.distance;
	});

	document.getElementById("weekdayOrWeekendLonger").innerText =
		mean(weekendDistances) > mean(weekdayDistances) ? "weekends" : "weekdays";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});