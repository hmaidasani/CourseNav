var map, fromProjection, toProjection, selectControl, selectedFeature, layer, data, features;
var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
function init() {
  map = new OpenLayers.Map({
            div: "basicMap",
            controls: [
                new OpenLayers.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.Zoom()
            ],
        });

  var mapnik         = new OpenLayers.Layer.OSM();
  fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position       = new OpenLayers.LonLat(-76.942658080223, 38.986575384046).transform( fromProjection, toProjection);
  var zoom           = 16;

  map.addLayer(mapnik);
  map.setCenter(position, zoom );
  
  var timeArr = [days[moment().day()], moment().hours(), moment().minutes()];
  // var timeArr = ['mon', 8, 00];
  getData(timeArr);
  setupTimePicker();
}

function formSubmit(form) {
  for(var i = 0; i<features.length; i++) {
    var feature = features[i];
    if (feature.popup) {
        popup.feature = null;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
  }
  layer.removeAllFeatures();
  //layer.destroyFeatures();
  layer.refresh();
  var timeArr = [form.day.value, form.time.value.split(":")[0], form.time.value.split(":")[1]];
  getData(timeArr);
}

function getData(timeArr) {
  var url = "scripts/getData.php";
  var params = "day="+timeArr[0]+"&hour="+parseInt(timeArr[1])+"&min="+parseInt(timeArr[2]);
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", url+"?"+params, true);
  xmlhttp.onreadystatechange = function()
  {
      if(xmlhttp.readyState==4 && xmlhttp.status == 200) {
          data = JSON.parse(xmlhttp.response);
          addMarkers();
      }
  }
  xmlhttp.send(null);
}


function addMarkers() {
  var style = new OpenLayers.Style({
    'externalGraphic': "img/pencil.png?"+Math.random(),
    'graphicHeight': 35,
    'graphicWidth': 25,
    'graphicXOffset': -10,
    'graphicYOffset': -30,
    'graphicOpacity': 1,
    'cursor': 'pointer'
  });

  var styleMap = new OpenLayers.StyleMap({'default': style, 'default':style});


  var wms = new OpenLayers.Layer.WMS( "OpenLayers WMS",
                "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'} );
  map.addLayer(wms);

  var count = Object.keys(data).length;
  console.log(count);
  features = new Array(count);
  var i =0;
  var splitArr;
  for(var key in data)
  {
    splitArr = key.split(',');
    features[i] = new OpenLayers.Feature.Vector(
                      new OpenLayers.Geometry.Point(splitArr[3], splitArr[2]).transform( fromProjection, toProjection)
                  );
    features[i].attributes.title = "Classes in " + splitArr[1];
    features[i++].attributes.description = popupRoomHtmlContent(data[key]);
  }

  layer = new OpenLayers.Layer.Vector('Points', {
                styleMap: styleMap
            });
            
  layer.addFeatures(features);

  layer.events.on({
      'featureselected': onFeatureSelect,
      'featureunselected': onFeatureUnselect
  });
  selectControl = new OpenLayers.Control.SelectFeature(layer);
  
  map.addControl(selectControl);
  selectControl.activate();
  map.addLayer(layer);
}

function popupRoomHtmlContent(roomsArr) {
  var content = "<div class='bldg-details'>\n";

  for(var i = 0; i < roomsArr.length; i++) {
    content += "<div class='primary'>\n";
    content += "Room " + roomsArr[i][0] + " | " + roomsArr[i][1] + " | " + roomsArr[i][2] + " | " + roomsArr[i][4] + "\n";
    content += "</div>\n";
    content += "<div class='secondary'>\n";
    content += roomsArr[i][6] + " | Section(s): " + roomsArr[i][5] + " | " + moment(roomsArr[i][7], "hh:mm").format("h:mma") + " - " + moment(roomsArr[i][8], "hh:mm").format("h:mma") + "\n";
    content += "</div>\n";
  }

  content += "</div>";
  return content;
}

function onPopupClose(evt) {
    // 'this' is the popup.
    selectControl.unselect(this.feature);
}
function onFeatureSelect(evt) {
    feature = evt.feature;
    popup = new OpenLayers.Popup.Anchored("featurePopup",
                             new OpenLayers.LonLat((feature.geometry.getBounds().getCenterLonLat().lon+0.0), (feature.geometry.getBounds().getCenterLonLat().lat-15.0)),
                             new OpenLayers.Size(500,200),
                             "<h5>"+feature.attributes.title + "</h5>" +
                             feature.attributes.description,
                             null, true, onPopupClose);
    popup.autoSize = true;
    
    feature.popup = popup;
    popup.feature = feature;
    map.addPopup(popup);
}
function onFeatureUnselect(evt) {
    feature = evt.feature;
    if (feature.popup) {
        popup.feature = null;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
}

function setupTimePicker(){

  $('#timepicker input').val(addZero(moment().hours()) +':'+ addZero(moment().minutes()));
  $('#timepicker input').keydown(function(e) {
   e.preventDefault();
   return false;
  });
  $('#timepicker, #timepicker input, #timepicker span').click(function(event){
    var content = popoverContent();
    $('#timepicker').popover({ 
      trigger: 'manual',
      placement: 'right',
      html : true,
      content : content
    });
    $('#timepicker').data('popover').options.html = true;
    $('#timepicker').data('popover').options.content = content;
    // $('.popover-content').html(popoverContent());
    $('#timepicker').popover('show');
    
    event.preventDefault();
    return false;
  });

  $(':not(#anything)').on('click', function (e) {
    $('#timepicker, #timepicker input, #timepicker span').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons and other elements within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
            return;
        }
    });
});
}

function popoverContent() {
  var str = $('#timepicker input').val();
  var hour = str.split(':')[0];
  var min = str.split(':')[1];
  return '<table class="table-condensed">' +
    '<tbody>' +
      '<tr>' +
        '<td>' +
          '<a href="javascript:timebtnfunc(\'add-hr\');" class="btn timebtn" id="incrementHours" data-action="incrementHours">' +
            '<i class="icon-chevron-up"></i>' +
          '</a>' +
        '</td>' +
        '<td class="separator"></td>' +
        '<td>' +
          '<a href="javascript:timebtnfunc(\'add-min\');" class="btn" id="incrementMinutes" data-action="incrementMinutes">' +
            '<i class="icon-chevron-up"></i>' +
          '</a>' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td>' +
          '<span data-action="showHours" data-time-component="hours" id="timepicker-hour">' +
          '<h6>' + hour +'</h6></span>' +
        '</td>' +
        '<td class="separator">:</td>' +
        '<td>' +
          '<span data-action="showMinutes" data-time-component="minutes" id="timepicker-minute">'+ 
          '<h6>' + min + '</h6></span>' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td>' +
          '<a href="javascript:timebtnfunc(\'sub-hr\');" class="btn" id="decrementHours" data-action="decrementHours">' +
            '<i class="icon-chevron-down"></i>' +
          '</a>' +
        '</td>' +
        '<td class="separator"></td>' +
        '<td>' +
          '<a href="javascript:timebtnfunc(\'sub-min\');" class="btn" id="decrementMinutes" data-action="decrementMinutes">' +
            '<i class="icon-chevron-down"></i>' +
          '</a>' +
        '</td>' +
      '</tr>' +
    '</tbody>' +
  '</table>';
}

function timebtnfunc(action) {
  var hour = moment($('#timepicker-hour h6').text(), "HH");
  var min = moment($('#timepicker-minute h6').text(), "mm");
  switch(action)
  {
    case "add-hr":
      hour.add('hours', 1);
      $('#timepicker-hour h6').text(addZero(hour.hours()));
      break;
    case "sub-hr":
      hour.subtract('hours', 1);
      $('#timepicker-hour h6').text(addZero(hour.hours()));
      break;
    case "add-min":
      min.add('minutes', 1);
      $('#timepicker-minute h6').text(addZero(min.minutes()));
      
      break;
    case "sub-min":
      min.subtract('minutes', 1);
      $('#timepicker-minute h6').text(addZero(min.get("minutes")));
      break;
  }
  $('#timepicker input').val(addZero(hour.hours()) +':'+ addZero(min.minutes()));
}

function addZero(timeNumber) {
  if(timeNumber<10)
    return "0"+timeNumber;
  else 
    return timeNumber;
}


