(function() {
  var settings = require('Storage').readJSON('hourstrike.json',1)||[];
  var t = new Date();
  var t_min_sec = t.getMinutes()*60+t.getSeconds();
  var wait_msec = settings.interval>0?(settings.interval-t_min_sec%settings.interval)*1000:-1;
  if (wait_msec>0) {
    t.setMilliseconds(t.getMilliseconds()+wait_msec);
    var t_hour = t.getHours();
    if (t_hour<settings.start||t_hour>settings.end) {
      var strike = new Date(t.getTime());
      strike.setHours(settings.start);
      strike.setMinutes(0);
      if (t_hour>settings.end) {
        strike.setDate(strike.getDate()+1);
      }
      wait_msec += strike-t;
      settings.next_hour = strike.getHours();
      settings.next_minute = strike.getMinutes();
    } else {
      settings.next_hour = t_hour;
      settings.next_minute = t.getMinutes();
    }
    require('Storage').write('hourstrike.json', settings);
    setTimeout(function() {load("hourstrike.js");}, wait_msec);
  }
})();
