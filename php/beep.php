<?php


$dataString = file_get_contents('php:input');
$data = json_decode(file_get_contents('php://input'), true);
    print_r($data);
    //echo $data["tracks"];
    echo "something something";

    $recentBeepFile = fopen(recentBeep.json, 'r');

    $fp = fopen('test.json', 'w');
    fwrite($fp, json_encode($data));
    fclose($fp);




?>