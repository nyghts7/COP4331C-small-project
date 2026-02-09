<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($input['Login'])) {
    if (isset($input['FirstName'])) {
        // SIGN-UP
        $hashed = password_hash($input['Password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
        $stmt->execute([$input['FirstName'], $input['LastName'], $input['Login'], $hashed]);
        echo json_encode(["ID" => $pdo->lastInsertId()]);
    } else {
        // LOGIN
        $stmt = $pdo->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");
        $stmt->execute([$input['Login']]);
        
        // !!! MUST specify FETCH_ASSOC here for basic db.php compatibility !!!
        $user = $stmt->fetch(PDO::FETCH_ASSOC); 

        if ($user && password_verify($input['Password'], $user['Password'])) {
            echo json_encode([
                "ID" => $user['ID'],
                "FirstName" => $user['FirstName'],
                "LastName" => $user['LastName']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
    }
}
?>