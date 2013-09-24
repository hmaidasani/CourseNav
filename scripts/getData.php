<?php
        $day = htmlspecialchars($_GET["day"]);
	$hour = htmlspecialchars($_GET["hour"]);
	$min = htmlspecialchars($_GET["min"]);
	$time = "$hour:$min:00";

	$min_int = (int) $min;
	
	while(0!= $min_int%5)
		  $min_int--;
		  
	#timeOn5 will be used as the 5minRangeStart time for the SQL query	  
	$timeOn5 = "$hour:$min_int:00";
	
        //echo "Today's Date/Time: " . $day . ", " . $time . "<hr>";

        // create connection
        $con=mysqli_connect("", "root", "password", "CourseLayer");
        // Check if connection succesful
	if(mysqli_connect_errno($con)){
        	echo "Failed to connect to MySQL: " .  mysqli_connect_error();
	}

        $query = "select * from ClassesByTime_$day where 5minRangeStart = '${timeOn5}' order by bldgAbbr, courseCode";
	//echo "Query: " . $query . "<br><hr>";
	$array = array();
	$result = mysqli_query($con, $query);
	while($row = mysqli_fetch_assoc($result)){
		$key = $row['bldgAbbr'] . ", " . $row['bldgName'] . ", " . $row['bldgLat'] . ", " . $row['bldgLon'];
		
		$subArray = array($row['roomNum'], $row['courseCode'], $row['courseName'], $row['courseDesc'], $row['courseType'], $row['sectionList'], $row['instructor'], $row['startTime'], $row['endTime']);


	 	$array[$key][] = $subArray;
	}

	//print_r($array);
	//echo "<hr><br>";
	echo  json_encode($array);

	?>

