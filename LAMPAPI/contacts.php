<?php
require_once 'db.php';

switch ($method) {
    case 'GET':
        // Read or Search
        $userID = $_GET['userID'] ?? null;
        $query = $_GET['query'] ?? ''; // Search string

        //Pagination terms, minimum 50, max 100
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
        if ($limit < 1) $limit = 50;
        if ($limit > 100) $limit = 100;

        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        if ($page < 1) $page = 1;

        $offset = ($page - 1) * $limit;

        // Create the partial search string
        $searchTerm = "%" . $query . "%";

        // 1) Total count (so front end can show "Page X of N")
        // SQL: Count how many entries there are where the userID matches and either name matches
        $countStmt = $conn->prepare(
            "SELECT COUNT(*) AS total
            FROM Contacts
            WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ?)"
        );
        
        $countStmt->bind_param("iss", $userID, $searchTerm, $searchTerm);
        $countStmt->execute();
        $total = intval($countStmt->get_result()->fetch_assoc()['total'] ?? 0);
		
        // Send Page results (Order By matters)
        $stmt = $conn->prepare(
            "SELECT *
            FROM Contacts
            WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ?)
            ORDER BY FirstName ASC, LastName ASC, ID ASC
            LIMIT ? OFFSET ?"
        );
        $stmt->bind_param("issii", $userID, $searchTerm, $searchTerm, $limit, $offset);
        $stmt->execute();

        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        sendResponse([
            "data" => $rows,
            "page" => $page,
            "limit" => $limit,
            "total" => $total,
            "totalPages" => ($limit > 0) ? (int)ceil($total / $limit) : 0
        ]);
        break;

    case 'POST':
        // Create
        $data = getRequestData();
        $stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email, PhoneNumber, Address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssss", $data['UserID'], $data['FirstName'], $data['LastName'], $data['Email'], $data['PhoneNumber'], $data['Address']);
        
        try {
            $stmt->execute();
            $data['ID'] = $conn->insert_id;
            sendResponse($data, 201);
        } catch (mysqli_sql_exception $e) {
			// MySQL error code for duplicate
            if ($e->getCode() === 1062) {
                sendResponse(["error" => "A contact with this information already exists."], 409);
            } else {
                sendResponse(["error" => "Could not create contact: " . $e->getMessage()], 400);
            }
        }
        break;

    case 'PUT':
        // Update
        $data = getRequestData();
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, PhoneNumber=?, Address=? WHERE ID=?");
        $stmt->bind_param("sssssi", $data['FirstName'], $data['LastName'], $data['Email'], $data['PhoneNumber'], $data['Address'], $data['ID']);
        
        //This returns true even if no rows were updated
        $stmt->execute();
        
        //This will give a positive reply only if a row was updated
        if ($stmt->affected_rows > 0){
            sendResponse($data);
        } else {
            sendResponse(["error" => "No contact updated"], 400);
        }
        
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
