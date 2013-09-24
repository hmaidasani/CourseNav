<!DOCTYPE HTML>
<html>
  <head>
    <title>CourseLayer</title>
    <link href="css/style.css" rel="stylesheet">
    <link href="css/bootstrap.css" rel="stylesheet">
  </head>
  
  <body onload="init();">

    <div class="container-fluid">
      <div class="row-fluid">
        <div class="span2">
          <div id="sidebar" class="well sidebar-nav">
            <ul class="nav nav-list">              
              <li><h3>CourseNav</h3></li>
              <li>
                <form id="timeform" action="javascript:void(0);" onsubmit="return formSubmit(this);">
                  <h5>Day:</h5>
                  <select class="select" name="day">
                    <option value="mon" selected>Monday</option>
                    <option value="tue">Tuesday</option>
                    <option value="wed">Wednesday</option>
                    <option value="thu">Thursday</option>
                    <option value="fri">Friday</option>
		    <option value="sat">Saturday</option>
		    <option value="sun">Sunday</option>
                  </select>
                  
                  <h5>Time:</h5>
                  <div id="timepicker" class="input-append">
                      <input name="time" data-format="hh:mm:ss" type="text" readonly="readonly"></input>
                      <span class="add-on">
                        <i class="icon-time"></i>
                      </span>
                  </div>
		  <button type="submit" class="btn btn-success submit">
                	<!--<i class="icon-circle-arrow-right icon-large"></i>-->Show Courses
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div><!--/span-->
        <div class="span10">
          <div id="basicMap"></div>
        </div>
      </div><!--/row-->

      <hr>
      <footer>
        <p>&copy;2013</p>
      </footer>
    </div>
    <script src="http://www.openlayers.org/api/OpenLayers.js"></script>
    <script src="js/jquery-1.10.2.min.js"></script>
    <script src="js/main.js?<?php echo rand() ?>"></script>
    <script src="js/bootstrap.js"></script>
    <script src="js/moment.min.js"></script>
  </body>
</html>
