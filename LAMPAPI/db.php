<?php
// CORS and JSON Headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (strtoupper($_SERVER['REQUEST_METHOD'] == 'OPTIONS')) {
    http_response_code(200);
    exit();
}

// Database Connection
$conn = new mysqli("localhost", "TheBeast", "PoosdTeam!@#", "ContactManager");
if ($conn->connect_error) {
    sendResponse(["error" => "Database connection failed"], 500);
}

$method = strtoupper($_SERVER['REQUEST_METHOD']);

function getRequestData() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}
?>
