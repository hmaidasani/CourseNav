<?php

#note: likely due to some caching effect, running this script again with the same time will result in a drastically decreased query time.

$con=mysqli_connect("", "root", "password", "CourseLayer");
// Check if connection succesful
if(mysqli_connect_errno($con)){	echo "\n".mysqli_connect_error()."\n"; }
$day = "tue";
#must be multiple of 5
$time = "15:20";

#test 1
$classesByTime_str = "select * from ClassesByTime_$day where 5minRangeStart = '$time'";
$msc = microtime(true);
if(!mysqli_query($con, $classesByTime_str)) {echo "classBT failed";}
$msc = microtime(true)-$msc;
echo "$msc seconds\n";

#test 2
$coursesOld_str = "select * from coursesOld where ${day}StartTime <='$time' and ${day}EndTime >= '$time'"; 
$msc = microtime(true);
if (!mysqli_query($con, $coursesOld_str)) {echo "coursesOld failed";}
$msc = microtime(true)-$msc;
echo "$msc seconds\n";

?>