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
        return this.writtenText.length > 0;
    }


    get writtenText():string {
        if (this.source != "completed_event") {
            return "";
        }

        const linkStart: number = this.text.indexOf(" https:");
        const dash: number = this.text.indexOf(" - ");

        if (linkStart == -1 || dash == -1) {
            return "";
        }
     
        return this.text.substring(dash, linkStart);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
            
        const kmIdx: number = this.text.indexOf(" km ");
        const miIdx: number = this.text.indexOf(" mi ");

        if (kmIdx == -1 && miIdx -1) {
            return "unknown";
        }
        
        const start: number = kmIdx > -1 ? kmIdx + 4 : miIdx + 4;

        return this.text.substring(start)
            .split(" with")[0]
            .split(" - ")[0]
            .split(" https")[0]
            .split(".")[0]
            .trim()
            .toLowerCase();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        
        const index: number = Math.max(this.text.indexOf(" km "), this.text.indexOf(" mi "));

        const words: string[] = this.text.substring(0, index).split(" ");
        const value: number = parseFloat(words[words.length-1]);

        if (this.text.indexOf("km") > 0) {
            return value / 1.609
        }
        
        return value;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}