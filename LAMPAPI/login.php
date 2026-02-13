<?php
require_once 'db.php';

if ($method === 'POST') {
    $data = getRequestData();
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");
    $stmt->bind_param("s", $data['Login']);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
	
	// To prevent hashing null values (empty password field)
    if (!isset($data['Password']) || !isset($data['Login'])) {
        sendResponse(["error" => "Login and Password are required"], 400);
    }

    $hash = password_hash($data['Password'], PASSWORD_DEFAULT);

    if ($user && password_verify($hash, $user['Password'])) {
        unset($user['Password']);
        sendResponse($user, 200);
    } else {
        sendResponse(["error" => "Invalid Login or Password"], 401);
    }
} else {
    sendResponse(["error" => "Method not allowed"], 405);
}
?>