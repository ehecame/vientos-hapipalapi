$(document).ready(function(){
  setSideMenuScrollFunc();
  initializeMap();
  setClosePopUpAction();
});

function setSideMenuScrollFunc(){
  $('.sideMenuTab a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
    && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target
      || $('[name=' + this.hash.slice(1) +']');
      if ($target.length) {
        var targetOffset = $target.offset().top;
        $('html,body').animate({scrollTop: targetOffset}, 1000);
        return false;
      }
    }
  });
  $(".sideMenuTab").click(function(e){
    var targetOffset = $($($(this).children()[0]).attr("href")).offset().top;
    $('html,body').animate({scrollTop: targetOffset}, 1000);
  });
}

function initializeMap(){
  var map = L.map('map');
  console.log(map);
  map.setView([19.34, -99.15], 12);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'ralexrdz.nnh64i75',
      accessToken: 'pk.eyJ1IjoicmFsZXhyZHoiLCJhIjoiY2lpZ2prZWV1MDJndXZ0bTFnMjlqNzNqciJ9.3oLuB9mb5jJlL5nYhlibZw'
  }).addTo(map);
   L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
  var redMarker = L.AwesomeMarkers.icon({
    icon: 'coffee',
    markerColor: 'red'
  });
  var markers = new L.FeatureGroup();
  markers.addLayer(L.marker([19.34,-99.15], {icon: redMarker}));
  map.addLayer(markers);
}

function setClosePopUpAction(){
  $("#registerPopUp").click(function(){$(this).find(".close")[0].click()});
  $("#loginPopUp").click(function(){$(this).find(".close")[0].click()})
}

function onRegisterBtnClicked{
  $.post( 
    "/api/project/shortregister", 
    $("#registerForm").serialize(), 
    function( data ) {
      console.log( data );
    }
  );
}