<?php

$con=mysqli_connect("", "root", "password", "CourseLayer");
// Check if connection succesful
if(mysqli_connect_errno($con)){	echo "\n".mysqli_connect_error()."\n"; }

$days = array("mon", "tue", "wed", "thu", "fri", "sat", "sun");

foreach($days as $day) {

$create_str = "create table if not exists ClassesByTime_$day ( 5minRangeStart time not null, bldgAbbr char(3) not null, bldgName varchar(255) not null, bldgLat decimal(10,8) not null, bldgLon decimal(10,8) not null, roomNum char(5) not null, courseCode char(8) not null, sectionList varchar(128) not null, courseName varchar(255) not null, courseType char(10) not null, instructor varchar(100) not null,startTime time not null, endTime time not null,courseDesc text not null, primary key(5minRangeStart, bldgAbbr, roomNum, courseCode))";

$create_query = mysqli_query($con, $create_str);
if(!$create_query) {echo "\n".mysqli_error($con)."\n";}
}

?>