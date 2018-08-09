<?php


$dataString = file_get_contents('php:input');
$data = json_decode(file_get_contents('php://input'), true); // incoming beep config json
    // print_r($data);
    //echo $data["tracks"];
    // echo "something something";

    // $id = intval($data["id"]);
    $id = $data["id"];


    

    if($id == 0){
        // no id assigned yet, increment the recentBeep.json and assign its new id

        $beepIncrementData = json_decode(file_get_contents("recentBeep.json"), true);
        // echo("recentbeepdata: ");
        // echo $beepIncrementData;
        // echo $beepIncrementData['recentBeep'];
        // echo("----");
        
        $id = intval($beepIncrementData['recentBeep']) + 1;
        //$id++;

        $beepIncrementData['recentBeep'] = $id;
        $fp = fopen('recentBeep.json', 'w');
        fwrite($fp, json_encode($beepIncrementData));
        fclose($fp);

        $newFileName = ""; // String for new, incremented filename
        $newFileName = $id.".json";

        $fp = fopen($newFileName, 'w'); // write new beeps json file
        fwrite($fp, json_encode($data));
        fclose($fp);
        // echo("wrote to file: ".$newFileName." with id: ".$id);
        // echo("recentbeepdata: ");
        // echo $beepIncrementData->recentBeep;
    }
    else{
        $fileName = "";
        $fileName = $id.".json";
        $fp = fopen($fileName, 'w');
        fwrite($fp, json_encode($data));
        fclose($fp);
        // echo("wrote to existing file: ".$newFileName." with id: ".$id);
    }

    // $recentBeepFile = fopen(recentBeep.json, 'r');

    // $fp = fopen('test.json', 'w');
    // fwrite($fp, json_encode($data));
    // fclose($fp);



    echo('{"id":'.$id.'}'); // return new id, to be stored in cookie




?>