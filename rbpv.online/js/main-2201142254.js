function RefreshPage() {
  location.reload(true);
}

function SelectAll(id) {
  document.getElementById(id).focus();
  document.getElementById(id).select();
}

function setRivals(date) {
  if(typeof date === "undefined") {
    var now = Date.now();
    //Start - 15:00:00 - Thur - 20:00:00 Thur UTC
    //End - 00:00:00 - Wed - 05:00:00 - Wed UTC
    var start = new Date("2020-01-02T20:00:00Z");
    for(var i = 7; now > start; i + 7) {
      start.setDate(start.getDate() + i);
    }
    var end = new Date("2020-01-01T05:00:00Z")
    for(var i = 7; now > end; i + 7) {
      end.setDate(end.getDate() + i);
    }
    if(start > end) {
      return countdown(end);
    } else {
      return countdown(start);
    }
  } else {
    return countdown(date);
  }
}

function countdown(date) {
  function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }

  var dayM = (1000 * 60 * 60 * 24);
  var hourM = (1000 * 60 * 60);
  var minM = (1000 * 60);
  var mil = 1000;

  var time = (new Date(date) - Date.now());
  if(time <= 0) {
    return "00:00:00:00";
  } else {
    var days = Math.trunc(time / dayM);
    time %= dayM;
    var hours = Math.trunc(time / hourM);
    time %= hourM;
    var mins = Math.trunc(time / minM);
    time %= minM;
    var secs = Math.trunc(time / mil);

    return (pad(days) + ':' + pad(hours) + ':' + pad(mins) + ':' + pad(secs));
  }
}

function ShowPathDivs() {
  $('#v').show();
  $('#h').show();
  $('#d').show();
  $('#g').show();
  $('#b').show();

  $('#spot-box').hide();
  $('#total-box').hide();
  $('#v-info').hide();
  $('#h-info').hide();
  $('#d-info').hide();
  $('#g-info').hide();
  $('#b-info').hide();
}

function ToggleInfo() {
  $('#v').toggle();
  $('#h').toggle();
  $('#d').toggle();
  $('#g').toggle();
  $('#b').toggle();

  $('#spot-box').toggle();
  $('#total-box').toggle();
  $('#v-info').toggle();
  $('#h-info').toggle();
  $('#d-info').toggle();
  $('#g-info').toggle();
  $('#b-info').toggle();

  if($('#total-box').is(":visible")) {
    $('#all-box').css('text-align','center');
  } else {
    $('#all-box').css('text-align','left');
  }
}

$(document).ready(function (){
  $('.wrong-btn').hide();
  $('#taps-icon').hide();
  $('.bre').hide();

  $('#updated').html(RBPV.lastUpdated);
  SetPatrons();
  DisplayPathers();

  ShowInfo();

  setInterval(function() {
    $('#countdown').html(setRivals());
  }, 100);

  // --Create autocomplete function
  $('#autocomplete').autocomplete({
    lookup: RBPV.songs,
    lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
      suggestNorm = suggestion.value.removeDiacritics().getAlphaNum().toLowerCase();
      queryLowerCase = queryLowerCase.getAlphaNum();
      return suggestNorm.indexOf(queryLowerCase) !== -1;
    },
    onSelect: function (song) {
      ShowSong(song);
    },
  });
});

function ShowSong(song) {
  ShowPathDivs();
  UpdateCheck();
  $('#all-box').css('text-align','left');

  SongSelected = song;
  $('#autocomplete').val(song.value);
  $('#autocomplete').attr('placeholder', song.value);

  //Spotlight info
  $('#spot-box').html(song.data.spotNote);

  var songName = song.value.replaceAll('🌟', '').trim();

  //PATH? buttons
  var preLink = 'https://docs.google.com/forms/d/e/1FAIpQLSf3QADdWQIGh6ldmUravM86g30Cp2UnxkHSQz7cm_dQvg23OA/viewform?usp=pp_url';
  preLink += '&entry.435572232=' + encodeURIComponent(songName);
  var vLink = preLink +    '&entry.1257065241=Vocals' + '&entry.924353831=' + encodeURIComponent(0) + '&entry.1966321028=' + encodeURIComponent(song.data.vpath);
  var hLink = preLink + '&entry.1257065241=Harmonies' + '&entry.924353831=' + encodeURIComponent(0) + '&entry.1966321028=' + encodeURIComponent(song.data.hpath);
  var dLink = preLink +     '&entry.1257065241=Drums' + '&entry.924353831=' + encodeURIComponent(0) + '&entry.1966321028=' + encodeURIComponent(song.data.dpath);
  var gLink = preLink +    '&entry.1257065241=Guitar' + '&entry.924353831=' + encodeURIComponent(song.data.gscore.replace(/,/g, '')) + '&entry.1966321028=' + encodeURIComponent(song.data.gpath);
  var bLink = preLink +      '&entry.1257065241=Bass' + '&entry.924353831=' + encodeURIComponent(song.data.bscore.replace(/,/g, '')) + '&entry.1966321028=' + encodeURIComponent(song.data.bpath);
  $('#v-wrong').attr('href', vLink);
  $('#h-wrong').attr('href', hLink);
  $('#d-wrong').attr('href', dLink);
  $('#g-wrong').attr('href', gLink);
  $('#b-wrong').attr('href', bLink);
  $('.wrong-btn').show();

  song.data.gpath = song.data.gpath.replace(/,/g, "\n");
  song.data.bpath = song.data.bpath.replace(/,/g, "\n");

  //BRE
  if(song.data.bre.toLowerCase() == "true") {
    $('.bre').show();
  } else {
    $('.bre').hide();
  }

  //Vox
  $('#v-path').text(song.data.vpath);
  if (song.data.vnote === "") {
    $('#v-note').hide();
  } else {
    $('#v-note-text').text(song.data.vnote);
    $('#v-note').show();
  }

  if(song.data.taps.toLowerCase() == "true") {
    $('#taps-icon').show();
  } else {
    $('#taps-icon').hide();
  }

  if(song.data.vvid !== "") {
    $('#v-vid').show();
    $('#v-vid').attr('href', song.data.vvid);
  }
  else {
    $('#v-vid').hide();
  }

  //Brutal
  if(song.data.vbnote !== "") {
    $('#v-brutal-note').text(song.data.vbnote);
    $('#v-box').css('background-color', 'indianred');
    $('#v-brutal').show();
  } else {
    $('#v-box').css('background-color', '#E6C88A');
    $('#v-brutal').hide();
  }

  //Harm
  if (song.data.hpath === "") {
    $('#h-path').text('No path yet. 😔');
  } else {
    $('#h-path').text(song.data.hpath);
  }
  if (song.data.hnote === "") {
    $('#h-note').hide();
  } else {
    $('#h-note-text').text(song.data.hnote);
    $('#h-note').show();
  }

  if(song.data.hvid !== "") {
    $('#h-vid').show();
    $('#h-vid').attr('href', song.data.hvid);
  }
  else {
    $('#h-vid').hide();
  }

  //Drum
  $('#d-path').text(song.data.dpath);
  if (song.data.dnote === "") {
    $('#d-note').hide();
  } else {
    $('#d-note-text').text(song.data.dnote);
    $('#d-note').show();
  }
  if(song.data.dscore !== "0") {
    $('#d-score').text(song.data.dscore);
    $('#d-score').show();
  }else {
    $('#d-score').hide();
  }
  if(song.data.dvid !== "") {
    $('#d-vid').show();
    $('#d-vid').attr('href', song.data.dvid);
  }
  else {
    $('#d-vid').hide();
  }

  //Guitar
  $('#g-path').text(song.data.gpath);
  if (song.data.gnote === "") {
    $('#g-note').hide();
  } else {
    $('#g-note-text').text(song.data.gnote);
    $('#g-note').show();
  }

  if(song.data.gscore !== "0") {
    $('#g-score').text(song.data.gscore);
    $('#g-score').show();
  }else {
    $('#g-score').hide();
  }
  if(song.data.gvid !== "") {
    $('#g-vid').show();
    $('#g-vid').attr('href', song.data.gvid);
  }
  else {
    $('#g-vid').hide();
  }

  //Bass
  $('#b-path').text(song.data.bpath);
  if (song.data.bnote === "") {
    $('#b-note').hide();
  } else {
    $('#b-note-text').text(song.data.bnote);
    $('#b-note').show();
  }

  if(song.data.bscore !== "0") {
    $('#b-score').text(song.data.bscore);
    $('#b-score').show();
  }else {
    $('#b-score').hide();
  }
  if(song.data.bvid !== "") {
    $('#b-vid').show();
    $('#b-vid').attr('href', song.data.bvid);
  }
  else {
    $('#b-vid').hide();
  }
}

function UpdateCheck() {
  FileExists('/js/rbpv-' + RBPV.currentVersion + '.js');
}

function FileExists(url) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 404) {
      $('#outOfDate').show();
    }
  };

  xhr.open("HEAD", url, true);
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  xhr.send();
}

function SetPatrons() {
  $('#patreon1').append(RBPV.patrons[0]);
  $('#patreon2').append(RBPV.patrons[1]);
  $('#patreon3').append(RBPV.patrons[2]);
}

function DisplayPathers() {
  var cDiv;
  var conIcon;
  var wallOfPathers = '';

  for (var i = 0; i < RBPV.pathers.length; i++) {
    if(i === 0) {
      cDiv = '<div class="carousel-item active">';
    } else {
      cDiv = '<div class="carousel-item">';
    }

    wallOfPathers += '<span';
    if(RBPV.pathers[i].paths > 249) {
      wallOfPathers += ' style="color:IndianRed;"'; //BS
    } else if(RBPV.pathers[i].paths > 149) {
      wallOfPathers += ' style="color:#A4DDED;"'; //DIA
    } else if(RBPV.pathers[i].paths > 99) {
      wallOfPathers += ' style="color:#E5E4E2;"'; //PLAT
    } else if(RBPV.pathers[i].paths > 49) {
      wallOfPathers += ' style="color:Gold;"';
    } else if(RBPV.pathers[i].paths > 24) {
      wallOfPathers += ' style="color:Silver;"';
    } else if(RBPV.pathers[i].paths > 9) {
      wallOfPathers += ' style="color:Peru;"';
    } else {
      wallOfPathers += ' style="color:gray;"';
    }
    wallOfPathers += ">" + RBPV.pathers[i].name + "&nbsp;&nbsp; ";
    wallOfPathers += '</span>'

    if(RBPV.pathers[i].console.toUpperCase() === "PLAYSTATION") {
      conIcon = '<i class="fab fa-playstation" style="color:MediumBlue;"></i>';
    } else {
      conIcon = '<i class="fab fa-xbox fa-xs" style="color:ForestGreen;"></i>';
    }

    $('#newPathers').append(cDiv + RBPV.pathers[i].name + ' ' + conIcon + ' ×' + RBPV.pathers[i].paths + '</div>');
  }
  $('#pathersModalBody').append(wallOfPathers);
}

function ShowInfo() {
  var total = Number(RBPV.vLength) + Number(RBPV.dLength) + Number(RBPV.gLength) + Number(RBPV.bLength) + Number(RBPV.hLength);
  $('#t-info-title').text('TOTAL PATHS: ' + total);
  $('#t-info-sub').text('SONG COUNT: ' + RBPV.songs.length);
  $('#v-info-title').text('VOCAL PATHS: ' + RBPV.vLength);
  $('#h-info-title').text('HARMONY PATHS: ' + RBPV.hLength);
  $('#d-info-title').text('DRUM PATHS: ' + RBPV.dLength);
  $('#g-info-title').text('GUITAR PATHS: ' + RBPV.gLength);
  $('#b-info-title').text('BASS PATHS: ' + RBPV.bLength);
  $('#all-box').css('text-align','center');
}

//var hrefWrong = "";
function ToggleInstr(i) {
  var box = i + 'box';
  var w = i + 'wrong';
  var e = i + 'enable';
  $(box).toggle();
  $(w).toggle();
  $(e).toggle();
}

//Setlist
var Setlist = [];
var SongSelected = "";
function SetlistAdd() {
  if(SongSelected != "") {
    Setlist.push(SongSelected);
    CreateSetlistHTML();
  }
}

function SetlistRemove(i) {
  Setlist.splice(i, 1);
  CreateSetlistHTML();
}

function CreateSetlistHTML() {
  $('#set1').html("");
  $('#set2').html("");
  for (var i = 0; i < Setlist.length; i++) {
    var setHTML = '<div class="btn-group btn-group-sm" role="group"><button class="list-group-item list-group-item-action list-group-item-dark p-1" onclick="SetlistSelect(\'' + i + '\')"><strong>' + Setlist[i].value + '</strong></button><button onclick="SetlistRemove(\'' + i + '\')" type="button" class="btn btn-sm btn-danger"><i class="fas fa-minus"></i></button></div>';
    if(i % 2 == 0) {
      $('#set1').append(setHTML);
    } else {
      $('#set2').append(setHTML);
    }
  }
}

function SetlistSelect(songIndex) {
  ShowSong(Setlist[songIndex]);
}
