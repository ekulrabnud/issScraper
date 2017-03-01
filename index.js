var request = require('request');
var cheerio = require('cheerio');
var Feed = require('feedparser');

let req = request('https://spotthestation.nasa.gov/sightings/xml_files/United_States_Illinois_Elmhurst.xml')
let feedParser = new Feed();


req.on('error',function(err){
    //handle errors
});

req.on('response',function(res){

    let stream = this;
    if(res.statusCode !==200){
        this.emit('error',new Error('Bad Status Code'));
    }
    else{
        stream.pipe(feedParser);
    }
})

feedParser.on('error',function(err){

    //handle errors
})

feedParser.on('readable',function(){

    var stream = this;
    var meta = this.meta;
    var item;
    let sightings = [];

    while(item = stream.read()){
     
       let details = item.description.split("<br/>")

       let date = details[0].replace('Date: ','')
       let time = details[1].replace('\n\t\t\t\tTime: ','');
       let duration = details[2].replace('\n\t\t\t\tDuration: ','');
       let max = details[3].replace('\n\t\t\t\t','');
       let approach = details[4].replace('\n\t\t\t\tApproach:','');
       let degrees = approach.split(' ')
       let realDegrees = parseInt(degrees[1])
    //    console.log(date,time,duration,approach,realDegrees)

       if (realDegrees > 30){
           sightings.push({"date":date,"time":time,"duration":duration,"degrees":realDegrees})
       }

     
    }
    if (sightings.length > 0) console.log(sightings);
})