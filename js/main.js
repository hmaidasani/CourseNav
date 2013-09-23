var map, fromProjection, toProjection, selectControl, selectedFeature, layer, data;
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
  
  //var timeArr = [days[moment().day()], moment().hours(), moment().minutes()];
  var timeArr = ['mon', 8, 00];
  getData(timeArr);
  setupTimePicker();
}

function formSubmit(form) {
  console.log(form.day);
  console.log(form.time);
  console.log(layer);
  layer.removeAllFeatures();
  //layer.destroyFeatures();
  layer.refresh();
  addMarkers();
}

function getData(timeArr) {
  var url = "scripts/getClasses.php";
  var params = "day="+timeArr[0]+"&hour="+timeArr[1]+"&min="+timeArr[2];
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

  var features = new Array(2);
  features[0] = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(-76.936205881916, 38.98996636708).transform( fromProjection, toProjection)
                );
  features[0].attributes.title = "Classes in CSI";
  features[0].attributes.description = "Classes:";
  features[1] = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(-76.942589539371, 38.988740515545).transform( fromProjection, toProjection)
                );
  features[1].attributes.title = "Classes in Biology-Psychology";
  features[1].attributes.description = "Classes:";








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

function onPopupClose(evt) {
    // 'this' is the popup.
    selectControl.unselect(this.feature);
}
function onFeatureSelect(evt) {
    feature = evt.feature;
    popup = new OpenLayers.Popup.Anchored("featurePopup",
                             new OpenLayers.LonLat((feature.geometry.getBounds().getCenterLonLat().lon+0.0), (feature.geometry.getBounds().getCenterLonLat().lat-15.0)),
                             new OpenLayers.Size(200,200),
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
    $('#timepicker').popover({ 
      placement: 'bottom',
      html : true, 
      content: popoverContent()

    });
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


