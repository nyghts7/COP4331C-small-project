<?php
$host = 'localhost';
$db   = 'COP4331';
$user = 'TheBeast';
$pass = 'WeLoveCOP4331';

try {
    // Basic connection string
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
} catch (PDOException $e) {
    // Minimal error reporting
    die("Connection failed: " . $e->getMessage());
}
?>
