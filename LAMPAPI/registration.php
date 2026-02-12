<?php
require_once 'db.php';

if ($method === 'POST') {
    $data = getRequestData();
    $hash = password_hash($data['Password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['FirstName'], $data['LastName'], $data['Login'], $hash);

    if ($stmt->execute()) {
		sendResponse([...], 201);
	} else {
		if ($conn->errno === 1062) {
			sendResponse(["error" => "This login is already taken"], 409);
		} else {
			sendResponse(["error" => "Database error: " . $conn->error], 500);
		}
	}
} else {
    sendResponse(["error" => "Method not allowed"], 405);
}
?>