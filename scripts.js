function getUnixTime(){
	var foo = new Date; // Generic JS date object
	var unixtime_ms = foo.getTime(); // Returns milliseconds since the epoch
	var unixtime = parseInt(unixtime_ms / 1000);
	return unixtime;
}

function getServerTime() {
	var url = "http://www.buzzwordoverload.co.uk/misc/undecimalcontroller/gettimestamp.php";
	var time = null;
	$.ajax({
		url: url,
		success: function(responseText){  
             time = responseText;
         },
		async:false
	});
	return time;
}

function getTimeDifference() {
	console.log(getUnixTime());
	console.log(getServerTime());
}
