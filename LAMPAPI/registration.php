<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db.php';

if ($method === 'POST') {
    $data = getRequestData();
    
    // To prevent hashing null values (empty password field)
    if (!isset($data['Password']) || !isset($data['Login'])) {
        sendResponse(["error" => "Login and Password are required"], 400);
    }

    $hash = password_hash($data['Password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['FirstName'], $data['LastName'], $data['Login'], $hash);

    try {
        $stmt->execute();
        sendResponse(["message" => "User created successfully"], 201);
    } catch (mysqli_sql_exception $e) {
        //MySQL code for Duplicate Entry
        if ($e->getCode() === 1062) {
            sendResponse(["error" => "This login is already taken"], 409);
        } else {
            sendResponse(["error" => "Database error: " . $e->getMessage()], 500);
        }
    }
} else {
    sendResponse(["error" => "Method not allowed"], 405);
}
?>