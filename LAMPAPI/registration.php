<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db.php';

if ($method === 'POST') {
    $data = getRequestData();
    $hash = password_hash($data['Password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['FirstName'], $data['LastName'], $data['Login'], $hash);

    if ($stmt->execute()) {
        sendResponse([
            "ID" => $conn->insert_id,
            "FirstName" => $data['FirstName'],
            "LastName" => $data['LastName'],
            "Login" => $data['Login']
        ], 201);
    } else {
        sendResponse(["error" => "User already exists or syntax error"], 409);
    }
} else {
    sendResponse(["error" => "Method not allowed"], 405);
}
?>