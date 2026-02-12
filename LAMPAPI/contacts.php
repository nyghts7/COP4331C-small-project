<?php
require_once 'db.php';

switch ($method) {
    case 'GET':
        // Read or Search
        $userID = $_GET['UserID'] ?? null;
        $query = $_GET['query'] ?? ''; // Search string
        $contactID = $_GET['ID'] ?? null; // For fetching a single contact

        if ($contactID) {
            // Get single contact
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
            $stmt->bind_param("i", $contactID);
        } else {
            // Search/List contacts for a user
            $searchTerm = "%$query%";
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ?)");
            $stmt->bind_param("iss", $userID, $searchTerm, $searchTerm);
        }
        
        $stmt->execute();
        sendResponse($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        break;

    case 'POST':
        // Create
        $data = getRequestData();
        $stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email, PhoneNumber, Address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssss", $data['UserID'], $data['FirstName'], $data['LastName'], $data['Email'], $data['PhoneNumber'], $data['Address']);
        
        if ($stmt->execute()) {
            $data['ID'] = $conn->insert_id;
            sendResponse($data, 201);
        } else {
            sendResponse(["error" => "Could not create contact"], 400);
        }
        break;

    case 'PUT':
        // Update
        $data = getRequestData();
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, PhoneNumber=?, Address=? WHERE ID=?");
        $stmt->bind_param("sssssi", $data['FirstName'], $data['LastName'], $data['Email'], $data['PhoneNumber'], $data['Address'], $data['ID']);
        
        $stmt->execute() ? sendResponse($data) : sendResponse(["error" => "Update failed"], 400);
        break;

    case 'DELETE':
        // Delete: contacts.php?ID=15
        $id = $_GET['ID'] ?? null;
        if (!$id) sendResponse(["error" => "Contact ID required"], 400);
        
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            sendResponse(["message" => "Contact deleted"]);
        } else {
            sendResponse(["error" => "Delete failed"], 400);
        }
        break;

    default:
        sendResponse(["error" => "Method not allowed"], 405);
        break;
}
?>
