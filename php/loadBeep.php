<?php


// if( isset($_POST["id"])){

//     $id = $_POST["id"];
//     $jsonUrl = $id."json"

//     $string = file_get_contents($jsonUrl);
//     // $json_a = json_decode($string, true);


//     echo $string;
    
//     exit();
//  }

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = $request->id;


$jsonUrl = "";
$jsonUrl = $id.".json";

$string = file_get_contents($jsonUrl);
// echo $string;
echo file_get_contents($jsonUrl);

exit();


 ?>
