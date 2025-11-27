<?php
// services/booking-service/index.php

// 1. HEADERS CORS (Doit être la toute première chose)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// DEBUG DANS LES LOGS DOCKER
error_log("--- [DEBUG] Script index.php atteint ! ---");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. CONFIGURATION DB
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbName = getenv('DB_NAME') ?: 'ms_bookings';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';

error_log("[DEBUG] Connexion DB vers: $dbHost");

// 3. CONNEXION DB
try {
    $conn = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("[DEBUG] Connexion DB Réussie !");
} catch(PDOException $e) {
    error_log("[ERREUR] Echec connexion DB: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Erreur Connexion DB"]);
    exit;
}

// 4. HELPERS
function getJwtPayload() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) return null;
    $parts = explode('.', str_replace('Bearer ', '', $headers['Authorization']));
    return count($parts) > 1 ? json_decode(base64_decode($parts[1]), true) : null;
}

function callService($url, $method = 'GET', $data = null) {
    error_log("[DEBUG] Appel Service: $url");
    $options = ["http" => ["header" => "Content-type: application/json\r\n", "method" => $method, "ignore_errors" => true]];
    if ($data) $options["http"]["content"] = json_encode($data);
    $result = @file_get_contents($url, false, stream_context_create($options));
    return $result ? json_decode($result, true) : null;
}

// 5. ROUTEUR
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'POST') {
    $user = getJwtPayload();
    if (!$user) { http_response_code(401); echo json_encode(["message" => "Non autorisé"]); exit; }

    $data = json_decode(file_get_contents("php://input"));
    error_log("[DEBUG] Données reçues pour réservation: " . print_r($data, true));

    if(empty($data->event_id) || empty($data->event_date)) {
        http_response_code(400); echo json_encode(["message" => "Données incomplètes"]); exit;
    }

    // Appel Event Service
    $stockResult = callService(getenv('EVENT_SERVICE_URL') . "/api/events/" . $data->event_id . "/decrement", "POST");
    if (isset($stockResult['message']) && $stockResult['message'] === 'Sold out') {
        http_response_code(409); echo json_encode(["message" => "Complet !"]); exit;
    }

    // Sauvegarde
    try {
        $stmt = $conn->prepare("INSERT INTO bookings SET user_id=:uid, event_id=:eid, event_title=:etitle, event_date=:edate");
        $stmt->execute([
            ':uid' => $user['sub'], ':eid' => $data->event_id, ':etitle' => $data->event_title, ':edate' => $data->event_date
        ]);
        
        // Notification
        $userEmail = $user['email'] ?? 'client@test.com';
        callService(getenv('NOTIF_SERVICE_URL') . "/api/send-email", "POST", [
            "type" => "ticket", "email" => $userEmail, "subject" => "Votre Billet",
            "event_title" => $data->event_title, "event_date" => $data->event_date,
            "user_name" => $user['name'] ?? 'Client', "booking_id" => $conn->lastInsertId()
        ]);

        http_response_code(201); echo json_encode(["message" => "Réservation OK"]);
    } catch(Exception $e) {
        error_log("[ERREUR] SQL: " . $e->getMessage());
        http_response_code(500); echo json_encode(["message" => "Erreur SQL"]);
    }
}
elseif ($method === 'GET') {
    $user = getJwtPayload();
    if (!$user) { http_response_code(401); exit; }
    
    $isAdmin = isset($user['role']) && $user['role'] === 'admin';
    $sql = $isAdmin ? "SELECT * FROM bookings ORDER BY created_at DESC" : "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC";
    $stmt = $isAdmin ? $conn->query($sql) : $conn->prepare($sql);
    if (!$isAdmin) $stmt->execute([$user['sub']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
elseif ($method === 'DELETE') {
    // Logique suppression simple
    http_response_code(200); echo json_encode(["message" => "Supprimé"]);
}
?>