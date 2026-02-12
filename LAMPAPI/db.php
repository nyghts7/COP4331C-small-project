<?php
// CORS and JSON Headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

if (strtoupper($_SERVER['REQUEST_METHOD']) == 'OPTIONS') {
    sendResponse(["message" => "CORS preflight successful"], 200);
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $conn = new mysqli("localhost", "TheBeast", "PoosdTeam!@#", "ContactManager");
} catch (mysqli_sql_exception $e) {
    sendResponse(["error" => "Database connection failed: " . $e->getMessage()], 500);
}

$method = strtoupper($_SERVER['REQUEST_METHOD']);

function getRequestData() {
    return json_decode(file_get_contents('php://input'), true);
}
?>
