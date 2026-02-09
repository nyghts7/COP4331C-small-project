<?php
require_once 'db.php';

// 1. Headers for JSON and CORS (Support SwaggerHub)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        $userId = isset($_GET['userId']) ? $_GET['userId'] : '0';
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        
        // 2. Server-Side Cache Logic
        $cache_key = md5("search_" . $userId . "_" . $search);
        $cache_file = "cache/" . $cache_key . ".json";

        if (file_exists($cache_file) && (time() - filemtime($cache_file) < 300)) {
            header("X-Cache: HIT");
            $fp = fopen($cache_file, 'rb');
            fpassthru($fp); // Stream directly to output
            exit;
        }

        // 3. Cache MISS: Query Database
        header("X-Cache: MISS");
        $searchTerm = "%" . $search . "%";
        
        // Search by First Name and/or Last Name
        $sql = "SELECT ID, FirstName, LastName, Email, PhoneNumber FROM Contacts 
                WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId, $searchTerm, $searchTerm]);

        if (!is_dir('cache')) mkdir('cache', 0777, true);
        $cache_handle = fopen($cache_file, 'wb');
        
        // 4. Memory-Efficient Streaming (No large arrays)
        echo "[";
        fwrite($cache_handle, "[");
        $first = true;

        // Explicitly use PDO::FETCH_ASSOC because basic db.php doesn't set it as default
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (!$first) {
                echo ",";
                fwrite($cache_handle, ",");
            }
            $json_row = json_encode($row);
            echo $json_row;
            fwrite($cache_handle, $json_row);
            $first = false;
        }

        echo "]";
        fwrite($cache_handle, "]");
        fclose($cache_handle);
        break;

    case 'POST':
        $sql = "INSERT INTO Contacts (UserID, FirstName, LastName, Email, PhoneNumber) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$input['UserID'], $input['FirstName'], $input['LastName'], $input['Email'], $input['PhoneNumber']]);
        
        // Clear search cache on data change
        array_map('unlink', glob("cache/*.json"));
        echo json_encode(["ID" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $sql = "UPDATE Contacts SET FirstName=?, LastName=?, Email=?, PhoneNumber=? WHERE ID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$input['FirstName'], $input['LastName'], $input['Email'], $input['PhoneNumber'], $id]);
        
        array_map('unlink', glob("cache/*.json"));
        echo json_encode(["status" => "updated"]);
        break;

    case 'DELETE':
        $sql = "DELETE FROM Contacts WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        
        array_map('unlink', glob("cache/*.json"));
        echo json_encode(["status" => "deleted"]);
        break;
}
?>