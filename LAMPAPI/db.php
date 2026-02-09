<?php
$host = 'localhost';
$db   = 'ContactManager';
$user = 'your_username';
$pass = 'your_password';

try {
    // Basic connection string
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
} catch (PDOException $e) {
    // Minimal error reporting
    die("Connection failed: " . $e->getMessage());
}
?>