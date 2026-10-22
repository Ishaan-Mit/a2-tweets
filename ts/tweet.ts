class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        else if (this.text.startsWith("Watch my ") && this.text.includes("@Runkeeper Live")) {
            return "live_event";
        }
        else if (this.text.includes("set a goal") || this.text.includes("Achieved a new personal record")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.source == "completed_event" && this.text.includes(" - ")) {
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        const start:number = this.text.indexOf(" - ");
        const end:number = this.text.indexOf(" https");
        
        if (start == -1 || end == -1 || start >= end) {
            return "";
        }
        
        return this.text.substring(start+3, end);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        const ind:number = this.text.indexOf("km") + this.text.indexOf("mi") + 1;

        if (this.text.indexOf("km") + this.text.indexOf("mi")) {

        }
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        const ind:number = this.text.indexOf("km") + this.text.indexOf("mi") + 1;


        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}