<?php
$day = htmlspecialchars($_GET["day"]);
$time = htmlspecialchars($_GET["hour"])  . ":" . htmlspecialchars($_GET["min"]) . ":00";
//echo "Today's Date/Time: " . $day . ", " . $time . "<hr>";

// create connection
$con=mysqli_connect("", "root", "password", "CourseLayer");
// Check if connection succesful
if(mysqli_connect_errno($con)){
        echo "Failed to connect to MySQL: " .  mysqli_connect_error();
}
//$dayStart = $day . "StartTime";
//$dayEnd = $day . "EndTime";
$query = "select crs.building, bld.name as bldName,  bld.lat, bld.lng, crs.courseCode, crs.sectionNumber, crs.name, crs.description, crs.type, crs.instructor, crs.room, crs." 
. $day . "StartTime, crs." . $day
.  "EndTime from coursesOld as crs, buildingsOld as bld where "
. $day  . "StartTime <='". $time ."' and " . $day  
."EndTime >= '" . $time 
."' and crs.building = bld.abbreviation order by crs.building, crs.courseCode, crs.sectionNumber";

$array = array();
$result2 = mysqli_query($con, $query);
while($row = mysqli_fetch_assoc($result2)){
        $key = $row['building'] . ", " . $row['bldName'] .", " . $row['lat'] . ", " . $row['lng'];
        $subArray = array_slice($row, 4);
        $array[$key][] = $subArray;
}
//print_r($array);

echo json_encode($array);;

?>
