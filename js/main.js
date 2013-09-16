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
  var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position       = new OpenLayers.LonLat(-76.942658080223, 38.986575384046).transform( fromProjection, toProjection);
  var zoom           = 16;

  map.addLayer(mapnik);
  map.setCenter(position, zoom );
 
 setupTimePicker();
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


