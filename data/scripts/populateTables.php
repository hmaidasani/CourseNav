<?php

	$con=mysqli_connect("", "root", "password", "CourseLayer");
        // Check if connection succesful
	if(mysqli_connect_errno($con)){	echo "\n".mysqli_connect_error()."\n"; }

	$days = array("mon", "tue", "wed", "thu", "fri", "sat", "sun");

	#iterate through days
	for ($index = 0; $index <= 6; $index++) {
	$day = $days[$index];
	echo "Populating entries for ${day}\n";


	#truncate table
	$truncate_ok = mysqli_query($con, "truncate table ClassesByTime_${day}");
	if(!$truncate_ok){ echo "\ntruncate error: ".mysqli_error($con)."\n";exit;}

	$hour = 0;
	$min = 0;
	$time = "";

	while($time != "23:55") {
	//construct string $time from $hour and $min
	if($min < 10) { $time = $hour . ":0" . $min; }
	else {  $time = $hour . ":" . $min; }

	#echo "$time\n";
	
	$classes_now_query = "select crs.building, bld.name as bldName,  bld.lat, bld.lng, crs.courseCode, crs.sectionNumber, crs.name, crs.description, crs.type, crs.instructor, crs.room, crs." . $day . "StartTime, crs." . $day .  "EndTime from coursesOld as crs, buildingsOld as bld where " . $day  . "StartTime <='". $time ."' and " . $day  ."EndTime > '" . $time ."' and crs.building = bld.abbreviation order by crs.building, crs.room, crs.sectionNumber";
	
	$classes_now = mysqli_query($con, $classes_now_query);
	
	//for each class found at this $time, add or update database
	while($class = mysqli_fetch_assoc($classes_now)){
	$bldgAbbr = $class['building'];
	$bldgName = addSlashes($class['bldName']);
	$bldgLat = $class['lat'];
	$bldgLon = $class['lng'];
	$roomNum = $class['room'];
	$courseCode = $class['courseCode'];
	$section = $class['sectionNumber'];
	$courseName = addslashes($class['name']);
	$courseType = $class['type'];
	$instructor = addslashes($class['instructor']);
	$startTime = $class[$day.'StartTime'];
	$endTime = $class[$day.'EndTime'];
	$courseDesc = addslashes($class['description']);
 	
	//prepare a query to see if course exists in database
	$existing_str = "select * from ClassesByTime_".$day." where 5minRangeStart = '$time' and bldgAbbr = '$bldgAbbr' and roomNum = '$roomNum' and courseCode = '$courseCode'";
	#echo "\nOK:existing query: $existing_str\n";
	$existing_query = mysqli_query($con, $existing_str);
	if(!$existing_query){ echo "\nexisting error: ".mysqli_error($con)."\n";exit;}
	$existing = mysqli_fetch_assoc($existing_query);
	
	//if exists add entry
	if(!$existing) {
	
	$insert_str = "insert into ClassesByTime_$day values ('$time','$bldgAbbr', '$bldgName', $bldgLat, $bldgLon, '$roomNum', '$courseCode', '$section', '$courseName', '$courseType', '$instructor', '$startTime', '$endTime', '$courseDesc')";
	$insert_query = mysqli_query($con, $insert_str);
	if(!$insert_query){ echo "\ninsert error: $insert_str\n\n".mysqli_error($con)."\n"; exit;}
	
	}
	//else grab, append,and update to sectionList string from existing entry
	else {
	$sectionList = $existing['sectionList'].", ".$section;
	$update_str = "update ClassesByTime_".$day." set sectionList = '".$sectionList."' where 5minRangeStart = '$time' and bldgAbbr = '$bldgAbbr' and roomNum = '$roomNum' and courseCode = '$courseCode'";
	$update_query = mysqli_query($con, $update_str);
	if(!$update_query){ echo "\nupdate error: $update_str\n\n".mysqli_error($con)."\n"; exit;}


	}

	}#end classes at this time while
	//increment time by 5 min
	if($min == 55) { $min = 0; $hour++;}
	else { $min+=5; }

	}#end time while
	$hour = 0;
	$min = 0;
	$time = "";
	}#end day for
?>