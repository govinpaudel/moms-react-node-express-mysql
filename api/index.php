<?php
if (!headers_sent()) {
    header("Content-Type: application/json; charset=UTF-8");
    // header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db_voucher.php";

// -----------------------------
// Parse the request
// -----------------------------
$basePath = "/api/voucher"; 
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace("#^$basePath#", "", $path);
$path = rtrim($path, "/");
$path = ltrim(strtolower($path), "/");  
$pathParts = $path === "" ? [] : explode("/", $path);
$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------
// Routing
// -----------------------------
if ($method === "GET") {
    switch ($pathParts[0] ?? "") {                
        case "getallaabas":
            getAllAabasHandler();
            break;        
        default:
            notFound();
    }
} elseif ($method === "POST") {
    switch ($pathParts[0] ?? "") {
        case "signup":
            signupHandler();
            break;
        case "login":
            loginHandler();
            break;
        case "getsidebarlist":
            getSidebarListHandler();
            break;
        case "getmonthlistbyaaba":            
            getMonthlistByAabaHandler();
            break;
        case "getvouchermonthly":
            getVoucherMonthlyHandler();
            break;
        default:
            methodNotAllowed();
    }
} else {
    methodNotAllowed();
}

// -----------------------------
// Handlers
// -----------------------------
function getAllAabasHandler(){
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    try {
        $stmt = $pdo->query("select * from voucher_aabas where isactive='1'");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            "status" => true,
            "message" => "डाटा प्राप्त भयो",
            "data" => $results            
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function loginHandler() {
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST data
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    $username = isset($input["username"]) ? trim($input["username"]) : "";
    $password = isset($input["password"]) ? trim($input["password"]) : "";

    // Required fields check
    if (!$username || !$password) {
        echo json_encode([
            "status" => false,
            "message" => "Username and password are required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        // Fetch user by username
        $stmt = $pdo->prepare("SELECT a.*,b.role_name,c.office_name FROM voucher_users a
inner join voucher_user_roles b on a.role=b.id
inner join voucher_offices c on a.office_id=c.id WHERE a.username = :username AND a.isactive='1'");
        $stmt->execute([":username" => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // User not found
        if (!$user) {
            echo json_encode([
                "status" => false,
                "message" => "User not found"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Verify hashed password
        if (!password_verify($password, $user["password"])) {
            echo json_encode([
                "status" => false,
                "message" => "Incorrect password"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Successful login
        echo json_encode([
            "status" => true,
            "message" => "Login successful",
            "data" => $user   // full user info returned like your other handlers
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getSidebarListHandler() {
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read input JSON
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    $user_id = isset($input["user_id"]) ? $input["user_id"] : "";
    $module  = isset($input["module"]) ? $input["module"] : "";

    if (!$user_id || !$module) {
        echo json_encode([
            "status" => false,
            "message" => "user_id and module are required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $sql = "
            SELECT 
                a.user_id,
                b.module,
                b.name,
                b.path
            FROM voucher_user_modules a
            INNER JOIN voucher_modules b ON a.module_id = b.id
            WHERE a.user_id = :user_id 
              AND b.module = :module
            ORDER BY b.module, b.display_order
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":user_id" => $user_id,
            ":module"  => $module
        ]);

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "Sidebar list प्राप्त भयो ।",
            "data" => $results
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getMonthlistByAabaHandler() {
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON input
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    $office_id = isset($input["office_id"]) ? $input["office_id"] : "";
    $aaba_id   = isset($input["aaba_id"]) ? $input["aaba_id"] : "";

    // Required fields check
    if (!$office_id || !$aaba_id) {
        echo json_encode([
            "status" => false,
            "message" => "office_id and aaba_id are required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $sql = "
            SELECT DISTINCT 
                a.month_id AS mid,
                b.month_name AS mname,
                b.month_order
            FROM voucher_details a
            INNER JOIN voucher_month b ON a.month_id = b.id
            WHERE a.office_id = :office_id
              AND a.aaba_id  = :aaba_id
            ORDER BY b.month_order
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":office_id" => $office_id,
            ":aaba_id"   => $aaba_id
        ]);

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status"  => true,
            "message" => "महिना सूची प्राप्त भयो ।",
            "data"    => $results
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getVoucherMonthlyHandler() {
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read input JSON
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    $aaba_id   = isset($input["aaba_id"]) ? $input["aaba_id"] : "";
    $office_id = isset($input["office_id"]) ? $input["office_id"] : "";
    $month_ids = isset($input["month_id"]) ? $input["month_id"] : [];

    // Validate required fields
    if (!$aaba_id || !$office_id || empty($month_ids)) {
        echo json_encode([
            "status" => false,
            "message" => "aaba_id, office_id and month_id are required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Convert month_id array to comma-separated quoted values
    $months = implode(",", array_map(function($m){
        return "'" . $m . "'";
    }, $month_ids));

    try {
        // Query 1: Registration
        $query1 = "
            SELECT 
                a.aaba_id,
                a.office_id,
                c.id AS sirshak_id,
                c.acc_sirshak_name,
                SUM(amount) AS amount
            FROM voucher_details a
            INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
            INNER JOIN voucher_acc_sirshak c ON b.acc_sirshak_id = c.id
            WHERE a.aaba_id = $aaba_id
              AND a.office_id = $office_id
              AND a.month_id IN ($months)
              AND c.id = 2
            GROUP BY aaba_id, office_id, c.id
        ";
        $stmt1 = $pdo->query($query1);
        $registration = $stmt1->fetchAll(PDO::FETCH_ASSOC);

        // Query 2: Summary
        $query2 = "
            SELECT 
                a.aaba_id,
                a.office_id,
                SUM(a.amount) AS amount,
                SUM(a.amount * (e.sangh) / 100) AS sangh,
                SUM(a.amount * (e.sanchitkosh) / 100) AS sanchitkosh,
                SUM(a.amount * (e.pardesh) / 100) AS pardesh,
                SUM(a.amount * (e.isthaniye) / 100) AS isthaniye
            FROM voucher_details a
            INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
            INNER JOIN voucher_acc_sirshak c ON c.id = b.acc_sirshak_id
            INNER JOIN voucher_offices d ON a.office_id = d.id
            INNER JOIN voucher_badhfadh e 
                ON e.aaba_id = a.aaba_id 
               AND e.acc_sirshak_id = c.id 
               AND e.state_id = d.state_id
            WHERE a.aaba_id = $aaba_id
              AND a.office_id = $office_id
              AND a.month_id IN ($months)
            GROUP BY a.aaba_id, a.office_id
        ";
        $stmt2 = $pdo->query($query2);
        $summary = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        // Query 3: Isthaniye (NAPA wise)
        $query3 = "
            SELECT 
                a.aaba_id,
                a.office_id,
                f.id AS sirshak_id,
                f.acc_sirshak_name,
                a.napa_id,
                e.napa_name,
                SUM(a.amount) AS amount,
                SUM(a.amount * (d.sanchitkosh)/100) AS sanchitkosh,
                SUM(a.amount * (d.pardesh)/100) AS pardesh,
                SUM(a.amount * (d.isthaniye)/100) AS isthaniye
            FROM voucher_details a
            INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
            INNER JOIN voucher_acc_sirshak f ON f.id = b.acc_sirshak_id
            INNER JOIN voucher_offices c ON a.office_id = c.id
            INNER JOIN voucher_badhfadh d 
                ON a.aaba_id = d.aaba_id 
               AND f.id = d.acc_sirshak_id 
               AND c.state_id = d.state_id
            INNER JOIN voucher_napa e 
                ON a.napa_id = e.id 
               AND a.office_id = e.office_id
            WHERE a.aaba_id = $aaba_id
              AND a.office_id = $office_id
              AND a.month_id IN ($months)
              AND f.id = 2
            GROUP BY 
                a.aaba_id, a.office_id, f.id, f.acc_sirshak_name,
                a.napa_id, e.napa_name
            ORDER BY a.napa_id, e.napa_name
        ";
        $stmt3 = $pdo->query($query3);
        $isthaniye = $stmt3->fetchAll(PDO::FETCH_ASSOC);

        // Query 4: Pardesh (Other Sirshak)
        $query4 = "
            SELECT 
                a.aaba_id,
                a.office_id,
                f.id,
                f.acc_sirshak_name,
                SUM(a.amount) AS amount,
                SUM(a.amount * (d.sanchitkosh)/100) AS sanchitkosh,
                SUM(a.amount * (d.pardesh)/100) AS pardesh,
                SUM(a.amount * (d.isthaniye)/100) AS isthaniye,
                SUM(a.amount * (d.sangh)/100) AS sangh
            FROM voucher_details a
            INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
            INNER JOIN voucher_acc_sirshak f ON f.id = b.acc_sirshak_id
            INNER JOIN voucher_offices c ON c.id = a.office_id
            INNER JOIN voucher_badhfadh d 
                ON a.aaba_id = d.aaba_id 
               AND f.id = d.acc_sirshak_id 
               AND c.state_id = d.state_id
            WHERE a.aaba_id = $aaba_id
              AND a.office_id = $office_id
              AND a.month_id IN ($months)
              AND a.sirshak_id != 1
            GROUP BY 
                a.aaba_id, a.office_id, f.id, f.acc_sirshak_name
            ORDER BY f.display_order
        ";
        $stmt4 = $pdo->query($query4);
        $pardesh = $stmt4->fetchAll(PDO::FETCH_ASSOC);

        // Final Response
        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापूर्वक प्राप्त भयो",
            "data" => [
                "registration" => $registration,
                "summary"      => $summary,
                "isthaniye"    => $isthaniye,
                "pardesh"      => $pardesh
            ]
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}

function notFound() { http_response_code(404); echo json_encode(["status"=>false,"message"=>"Not Found"]); exit(); }
function methodNotAllowed() { http_response_code(405); echo json_encode(["status"=>false,"message"=>"Method Not Allowed"]); exit(); }
function respondDbError($e) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"Database Error","error"=>$e->getMessage()]); exit(); }
function dbUnavailable($type) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"$type database not available"]); exit(); }
function invalidInput($field) { http_response_code(400); echo json_encode(["status"=>false,"message"=>"Invalid input: $field"]); exit(); }
?>
