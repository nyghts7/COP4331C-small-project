<?php
require_once 'db.php';

if ($method === 'POST') {
    $data = getRequestData();
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");
    $stmt->bind_param("s", $data['Login']);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if ($user && password_verify($data['Password'], $user['Password'])) {
        unset($user['Password']);
        sendResponse($user, 200);
    } else {
        sendResponse(["error" => "Invalid Login or Password"], 401);
    }
} else {
    sendResponse(["error" => "Method not allowed"], 405);
}
?>