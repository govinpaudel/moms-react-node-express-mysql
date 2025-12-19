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
        case "gettodaysvoucher":
            getTodaysVoucherHandler();
            break;
        case "fantlist":
            getFantListHandler();
            break;
        case "voucherofficesum":
            getVoucherOfficeSumHandler();
            break;
        case "vouchersumbydate":
            VoucherSumByDateHandler();
            break;
        case "userlist":
            userListHandler();
            break;
        case "voucherbydate":
            VoucherByDateHandler();
            break;
        case "monthlistbyaaba":
            MonthlistByAabaHandler();
            break; 
        case "fantlistbyaabamonth":
            FantlistByAabaMonthHandler();
            break;
        case "userlistbyaabamonthfant":
            UserlistByAabaMonthFantHandler();
            break;
        case "voucherfant":
            voucherFantHandler();
            break;
        case "voucherpalika":
            VoucherPalikaHandler();
            break;
        case "getvouchermaster":
            getVoucherMasterHandler();
            break;
        case "addorupdatevoucher":
            addOrUpdateVoucherHandler();
            break;
        case "listusers":
            listUsersHandler();
            break;
        case "changeuserstatus":
            changeUserStatusHandler();
            break;
        case "resetpassword":
            resetPasswordHandler();
            break;
        case "liststates":
            listStatesHandler();
            break;
        case "listbadhfandbystates":
            listBadhfandByStatesHandler();
            break;
        case "listofficesbystates":
            listOfficesByStatesHandler();
            break;
        case "updatestateofoffice":
            updateStateOfOfficeHandler();
            break;
        case "changepassword":
            changePasswordHandler();
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
    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST data
    $input = json_decode(file_get_contents("php://input"), true);

    $username   = trim($input["username"] ?? "");
    $password   = trim($input["password"] ?? "");
    $todaydate  = trim($input["todaydate"] ?? "");

    // Required fields check
    if (!$username || !$password) {
        echo json_encode([
            "status" => false,
            "message" => "प्रयोगकर्ता नाम वा पासवर्ड मिलेन ।"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $sql = "
        SELECT 
            a.*,
            b.role_name,
            c.office_name,
            c.expire_at,
            d.state_name,
            c.usenepcalendar,
            c.isvoucherchecked,
            c.isvoucherenabled
        FROM voucher_users a
        INNER JOIN voucher_user_roles b ON a.role = b.id
        INNER JOIN voucher_offices c ON a.office_id = c.id
        INNER JOIN voucher_state d ON d.id = c.state_id
        WHERE a.username = :username
        LIMIT 1
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([":username" => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // 1️⃣ Username does not exist
        if (!$user) {
            echo json_encode([
                "status" => false,
                "message" => "प्रयोगकर्ता नाम वा पासवर्ड मिलेन ।"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // 2️⃣ Username exists but password does not match
        if (!password_verify($password, $user["password"])) {
            echo json_encode([
                "status" => false,
                "message" => "प्रयोगकर्ता नाम वा पासवर्ड मिलेन ।"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // 3️⃣ Office expire check (NULL or expired)
        if (
            empty($user["expire_at"]) ||
            strtotime($user["expire_at"]) < strtotime($todaydate)
        ) {
            echo json_encode([
                "status" => false,
                "message" => "कार्यालय नविकरण गरिएको छैन कृपया नविकरण गर्नु होला ।"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // 4️⃣ User not active
        if ((int)$user["isactive"] === 0) {
            echo json_encode([
                "status" => false,
                "message" => "प्रयोगकर्ता सक्रिय गरिएको छैन । कृपया व्यवस्थापक लाई सम्पर्क राख्नु होला "
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // 5️⃣ Successful login
        echo json_encode([
            "status" => true,
            "message" => "प्रयोगकर्ता सफलतापुर्वक लगईन भयो ।",
            "data" => $user
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
function getTodaysVoucherHandler() {
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST data
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    $created_by_user_id = isset($input["created_by_user_id"]) ? $input["created_by_user_id"] : "";

    if (!$created_by_user_id) {
        echo json_encode([
            "status" => false,
            "message" => "created_by_user_id is required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Get today's date in YYYY-MM-DD
    $todayDate = date('Y-m-d');

    try {
        $sql = "
            SELECT 
                a.*,
                b.sirshak_name,
                c.napa_name,
                e.fant_name,
                f.nepname
            FROM voucher_details a
            INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
            INNER JOIN voucher_napa c ON a.office_id = c.office_id AND a.napa_id = c.id
            INNER JOIN voucher_fant e ON a.fant_id = e.id
            INNER JOIN voucher_users f ON a.created_by_user_id = f.id
            WHERE a.created_by_user_id = :user_id
              AND DATE_FORMAT(a.created_at,'%Y-%m-%d') = :today
            ORDER BY a.created_at
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":user_id" => $created_by_user_id,
            ":today"   => $todayDate
        ]);

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "data" => $results
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getFantListHandler() {
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Read JSON POST data
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    $office_id = isset($input["office_id"]) ? trim($input["office_id"]) : "";
    $aaba_id = isset($input["aaba_id"]) ? trim($input["aaba_id"]) : "";

    // Required fields check
    if (!$office_id || !$aaba_id) {
        echo json_encode([
            "status" => false,
            "message" => "Office ID and Aaba ID are required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT DISTINCT 
                a.fant_id AS fid,
                b.fant_name AS fname,
                b.display_order
            FROM voucher_details a
            INNER JOIN voucher_fant b ON a.fant_id = b.id
            WHERE a.office_id = :office_id AND a.aaba_id = :aaba_id
            ORDER BY b.display_order
        ");

        $stmt->execute([
            ":office_id" => $office_id,
            ":aaba_id" => $aaba_id
        ]);

        $fants = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "fants" => $fants
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e); // Your existing DB error handler
    }
}
function getVoucherOfficeSumHandler() {

    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $input = json_decode(file_get_contents("php://input"), true);
    $aaba_id   = $input["aaba_id"]   ?? "";
    $office_id = $input["office_id"] ?? "";

    if (!$aaba_id || !$office_id) {
        echo json_encode([
            "status" => false,
            "message" => "aaba_id and office_id required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        /* =====================================================
           1. OFFICE SUM
        ===================================================== */
        $officeSQL = "
        SELECT c.id sirshak_id, c.acc_sirshak_name,
            SUM(CASE WHEN a.month_id=4 THEN a.amount ELSE 0 END) A,
            SUM(CASE WHEN a.month_id=5 THEN a.amount ELSE 0 END) B,
            SUM(CASE WHEN a.month_id=6 THEN a.amount ELSE 0 END) C,
            SUM(CASE WHEN a.month_id=7 THEN a.amount ELSE 0 END) D,
            SUM(CASE WHEN a.month_id=8 THEN a.amount ELSE 0 END) E,
            SUM(CASE WHEN a.month_id=9 THEN a.amount ELSE 0 END) F,
            SUM(CASE WHEN a.month_id=10 THEN a.amount ELSE 0 END) G,
            SUM(CASE WHEN a.month_id=11 THEN a.amount ELSE 0 END) H,
            SUM(CASE WHEN a.month_id=12 THEN a.amount ELSE 0 END) I,
            SUM(CASE WHEN a.month_id=1 THEN a.amount ELSE 0 END) J,
            SUM(CASE WHEN a.month_id=2 THEN a.amount ELSE 0 END) K,
            SUM(CASE WHEN a.month_id=3 THEN a.amount ELSE 0 END) L,
            SUM(a.amount) total_amount
        FROM voucher_details a
        JOIN voucher_sirshak b ON a.sirshak_id=b.id
        JOIN voucher_acc_sirshak c ON b.acc_sirshak_id=c.id
        WHERE a.aaba_id=:aaba1 AND a.office_id=:office1
        GROUP BY c.id, c.acc_sirshak_name

        UNION ALL

        SELECT 9999,'कार्यालय जम्मा',
            SUM(CASE WHEN month_id=4 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=5 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=6 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=7 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=8 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=9 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=10 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=11 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=12 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=1 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=2 THEN amount ELSE 0 END),
            SUM(CASE WHEN month_id=3 THEN amount ELSE 0 END),
            SUM(amount)
        FROM voucher_details
        WHERE aaba_id=:aaba2 AND office_id=:office2
        ";

        $stmt = $pdo->prepare($officeSQL);
        $stmt->execute([
            ":aaba1"=>$aaba_id, ":office1"=>$office_id,
            ":aaba2"=>$aaba_id, ":office2"=>$office_id
        ]);
        $officeSum = $stmt->fetchAll(PDO::FETCH_ASSOC);


        /* =====================================================
           2. PARDESH SUM
        ===================================================== */
        $pardeshSQL = "
        SELECT a.aaba_id,a.office_id,c.id,c.acc_sirshak_name,
  SUM(a.amount * (e.pardesh / 100)) AS total_amount,
  SUM(CASE WHEN a.month_id = 4 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'A',
  SUM(CASE WHEN a.month_id = 5 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'B',
  SUM(CASE WHEN a.month_id = 6 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'C',
  SUM(CASE WHEN a.month_id = 7 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'D',
  SUM(CASE WHEN a.month_id = 8 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'E',
  SUM(CASE WHEN a.month_id = 9 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'F',
  SUM(CASE WHEN a.month_id = 10 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'G',
  SUM(CASE WHEN a.month_id = 11 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'H',
  SUM(CASE WHEN a.month_id = 12 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'I',
  SUM(CASE WHEN a.month_id = 1 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'J',
  SUM(CASE WHEN a.month_id = 2 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'K',
  SUM(CASE WHEN a.month_id = 3 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'L'
FROM voucher_details a
INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
INNER JOIN voucher_acc_sirshak c ON b.acc_sirshak_id = c.id
INNER JOIN voucher_offices d ON a.office_id = d.id
INNER JOIN voucher_badhfadh e ON e.aaba_id = a.aaba_id AND e.acc_sirshak_id = c.id AND e.state_id = d.state_id
WHERE a.aaba_id = :aaba3 AND a.office_id = :office3
GROUP BY a.aaba_id, a.office_id, c.id,c.acc_sirshak_name
UNION ALL
SELECT a.aaba_id,a.office_id,9999 AS id, 'जम्मा ' as acc_sirshak_name,
 SUM(a.amount * (e.pardesh / 100)) AS total_amount,
  SUM(CASE WHEN a.month_id = 4 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'A',
  SUM(CASE WHEN a.month_id = 5 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'B',
  SUM(CASE WHEN a.month_id = 6 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'C',
  SUM(CASE WHEN a.month_id = 7 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'D',
  SUM(CASE WHEN a.month_id = 8 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'E',
  SUM(CASE WHEN a.month_id = 9 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'F',
  SUM(CASE WHEN a.month_id = 10 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'G',
  SUM(CASE WHEN a.month_id = 11 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'H',
  SUM(CASE WHEN a.month_id = 12 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'I',
  SUM(CASE WHEN a.month_id = 1 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'J',
  SUM(CASE WHEN a.month_id = 2 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'K',
  SUM(CASE WHEN a.month_id = 3 THEN a.amount * (e.pardesh / 100) ELSE 0 END) AS 'L'
FROM voucher_details a
INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
INNER JOIN voucher_acc_sirshak c ON b.acc_sirshak_id = c.id
INNER JOIN voucher_offices d ON a.office_id = d.id
INNER JOIN voucher_badhfadh e ON e.aaba_id = a.aaba_id AND e.acc_sirshak_id = c.id AND e.state_id = d.state_id
WHERE a.aaba_id = :aaba4 AND a.office_id = :office4
GROUP BY a.aaba_id, a.office_id
ORDER BY aaba_id, office_id, id
        ";

        $stmt = $pdo->prepare($pardeshSQL);
        $stmt->execute([
            ":aaba3"=>$aaba_id,
            ":office3"=>$office_id,
            ":aaba4"=>$aaba_id,
            ":office4"=>$office_id,
        ]);
        $pardesh = $stmt->fetchAll(PDO::FETCH_ASSOC);


        /* =====================================================
           3. SANCHITKOSH SUM
        ===================================================== */
        $sanchitSQL = "
        SELECT a.aaba_id,a.office_id,c.id,c.acc_sirshak_name,
  SUM(a.amount * (e.sanchitkosh / 100)) AS total_amount,
  SUM(CASE WHEN a.month_id = 4 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'A',
  SUM(CASE WHEN a.month_id = 5 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'B',
  SUM(CASE WHEN a.month_id = 6 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'C',
  SUM(CASE WHEN a.month_id = 7 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'D',
  SUM(CASE WHEN a.month_id = 8 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'E',
  SUM(CASE WHEN a.month_id = 9 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'F',
  SUM(CASE WHEN a.month_id = 10 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'G',
  SUM(CASE WHEN a.month_id = 11 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'H',
  SUM(CASE WHEN a.month_id = 12 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'I',
  SUM(CASE WHEN a.month_id = 1 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'J',
  SUM(CASE WHEN a.month_id = 2 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'K',
  SUM(CASE WHEN a.month_id = 3 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'L'
FROM voucher_details a
INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
INNER JOIN voucher_acc_sirshak c ON b.acc_sirshak_id = c.id
INNER JOIN voucher_offices d ON a.office_id = d.id
INNER JOIN voucher_badhfadh e 
  ON e.aaba_id = a.aaba_id 
  AND e.acc_sirshak_id = c.id 
  AND e.state_id = d.state_id
INNER JOIN voucher_napa f ON a.office_id = f.office_id AND a.napa_id = f.napa_id
WHERE a.aaba_id = :aaba4 AND a.office_id = :office4
GROUP BY a.aaba_id, a.office_id, c.id,c.acc_sirshak_name
UNION ALL
SELECT a.aaba_id,a.office_id,9999 AS id, 'जम्मा ' as acc_sirshak_name,
 SUM(a.amount * (e.sanchitkosh / 100)) AS total_amount,
  SUM(CASE WHEN a.month_id = 4 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'A',
  SUM(CASE WHEN a.month_id = 5 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'B',
  SUM(CASE WHEN a.month_id = 6 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'C',
  SUM(CASE WHEN a.month_id = 7 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'D',
  SUM(CASE WHEN a.month_id = 8 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'E',
  SUM(CASE WHEN a.month_id = 9 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'F',
  SUM(CASE WHEN a.month_id = 10 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'G',
  SUM(CASE WHEN a.month_id = 11 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'H',
  SUM(CASE WHEN a.month_id = 12 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'I',
  SUM(CASE WHEN a.month_id = 1 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'J',
  SUM(CASE WHEN a.month_id = 2 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'K',
  SUM(CASE WHEN a.month_id = 3 THEN a.amount * (e.sanchitkosh / 100) ELSE 0 END) AS 'L'
FROM voucher_details a
INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
INNER JOIN voucher_acc_sirshak c ON b.acc_sirshak_id = c.id
INNER JOIN voucher_offices d ON a.office_id = d.id
INNER JOIN voucher_badhfadh e 
  ON e.aaba_id = a.aaba_id 
  AND e.acc_sirshak_id = c.id 
  AND e.state_id = d.state_id
INNER JOIN voucher_napa f ON a.office_id = f.office_id AND a.napa_id = f.napa_id
WHERE a.aaba_id = :aaba5 AND a.office_id = :office5
GROUP BY a.aaba_id, a.office_id
ORDER BY aaba_id, office_id, id
        ";

$stmt = $pdo->prepare($sanchitSQL);
$stmt->execute([
            ":aaba4"=>$aaba_id,
            ":office4"=>$office_id,
            ":aaba5"=>$aaba_id,
            ":office5"=>$office_id,
        ]);
        $sanchitkosh = $stmt->fetchAll(PDO::FETCH_ASSOC);
        /* =====================================================
           4. Ishtaniye
        ===================================================== */
        $IshtaniyeSQL = "
        SELECT a.aaba_id,a.office_id,a.napa_id,f.napa_name,
  SUM(a.amount * (e.isthaniye / 100)) AS total_amount,
  SUM(CASE WHEN a.month_id = 4 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'A',
  SUM(CASE WHEN a.month_id = 5 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'B',
  SUM(CASE WHEN a.month_id = 6 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'C',
  SUM(CASE WHEN a.month_id = 7 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'D',
  SUM(CASE WHEN a.month_id = 8 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'E',
  SUM(CASE WHEN a.month_id = 9 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'F',
  SUM(CASE WHEN a.month_id = 10 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'G',
  SUM(CASE WHEN a.month_id = 11 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'H',
  SUM(CASE WHEN a.month_id = 12 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'I',
  SUM(CASE WHEN a.month_id = 1 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'J',
  SUM(CASE WHEN a.month_id = 2 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'K',
  SUM(CASE WHEN a.month_id = 3 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'L'
FROM voucher_details a
INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
INNER JOIN voucher_acc_sirshak c ON b.acc_sirshak_id = c.id
INNER JOIN voucher_offices d ON a.office_id = d.id
INNER JOIN voucher_badhfadh e 
  ON e.aaba_id = a.aaba_id 
  AND e.acc_sirshak_id = c.id 
  AND e.state_id = d.state_id
INNER JOIN voucher_napa f ON a.office_id = f.office_id AND a.napa_id = f.napa_id
WHERE a.aaba_id = :aaba9 AND a.office_id = :office9
GROUP BY a.aaba_id, a.office_id, a.napa_id, f.napa_name
UNION ALL
SELECT a.aaba_id,a.office_id,9999 AS napa_id, 'जम्मा ' as napa_name,
 SUM(a.amount * (e.isthaniye / 100)) AS total_amount,
  SUM(CASE WHEN a.month_id = 4 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'A',
  SUM(CASE WHEN a.month_id = 5 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'B',
  SUM(CASE WHEN a.month_id = 6 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'C',
  SUM(CASE WHEN a.month_id = 7 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'D',
  SUM(CASE WHEN a.month_id = 8 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'E',
  SUM(CASE WHEN a.month_id = 9 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'F',
  SUM(CASE WHEN a.month_id = 10 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'G',
  SUM(CASE WHEN a.month_id = 11 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'H',
  SUM(CASE WHEN a.month_id = 12 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'I',
  SUM(CASE WHEN a.month_id = 1 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'J',
  SUM(CASE WHEN a.month_id = 2 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'K',
  SUM(CASE WHEN a.month_id = 3 THEN a.amount * (e.isthaniye / 100) ELSE 0 END) AS 'L'
FROM voucher_details a
INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
INNER JOIN voucher_acc_sirshak c ON b.acc_sirshak_id = c.id
INNER JOIN voucher_offices d ON a.office_id = d.id
INNER JOIN voucher_badhfadh e 
  ON e.aaba_id = a.aaba_id 
  AND e.acc_sirshak_id = c.id 
  AND e.state_id = d.state_id
INNER JOIN voucher_napa f ON a.office_id = f.office_id AND a.napa_id = f.napa_id
WHERE a.aaba_id = :aaba10 AND a.office_id = :office10
GROUP BY a.aaba_id, a.office_id
ORDER BY aaba_id, office_id, napa_id
        
        ";

        $stmt = $pdo->prepare($IshtaniyeSQL);
        $stmt->execute([
            ":aaba9"=>$aaba_id, ":office9"=>$office_id,
            ":aaba10"=>$aaba_id, ":office10"=>$office_id
        ]);
        $isthaniyeSum = $stmt->fetchAll(PDO::FETCH_ASSOC);       


        echo json_encode([
            "status" => true,
            "officesum" => $officeSum,
            "pardesh" => $pardesh,
            "sanchitkosh" => $sanchitkosh,
            "isthaniye"=>$isthaniyeSum
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function VoucherSumByDateHandler() {

    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Read JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    $aaba_id    = $input["aaba_id"]    ?? "";
    $office_id  = $input["office_id"]  ?? "";
    $start_date = $input["start_date"] ?? "";
    $end_date   = $input["end_date"]   ?? "";
    $fant_ids   = $input["fant_id"]    ?? [];

    // Validation
    if (
        !$aaba_id || !$office_id ||
        !$start_date || !$end_date ||
        !is_array($fant_ids) || count($fant_ids) === 0
    ) {
        echo json_encode([
            "status" => false,
            "message" => "Required parameters missing"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        /* -----------------------------------------------------
           Build dynamic IN (?, ?, ?) safely
        ----------------------------------------------------- */
        $placeholders = implode(",", array_fill(0, count($fant_ids), "?"));

        $sql = "
        SELECT 
            a.aaba_id,
            a.office_id,
            a.sirshak_id,
            b.sirshak_name,
            SUM(a.amount) AS amount
        FROM voucher_details a
        INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
        WHERE a.aaba_id = ?
          AND a.office_id = ?
          AND a.edate_transaction >= ?
          AND a.edate_transaction <= ?
          AND a.fant_id IN ($placeholders)
        GROUP BY a.aaba_id, a.office_id, a.sirshak_id, b.sirshak_name
        ";

        $stmt = $pdo->prepare($sql);

        // Bind parameters in correct order
        $params = array_merge(
            [$aaba_id, $office_id, $start_date, $end_date],
            $fant_ids
        );

        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "data" => $data
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function userListHandler() {

    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Read JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    $office_id = $input["office_id"] ?? "";
    $aaba_id   = $input["aaba_id"]   ?? "";

    // Validation
    if (!$office_id || !$aaba_id) {
        echo json_encode([
            "status" => false,
            "message" => "office_id and aaba_id required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        $sql = "
        SELECT DISTINCT
            a.created_by_user_id AS uid,
            b.nepname AS uname
        FROM voucher_details a
        INNER JOIN voucher_users b ON a.created_by_user_id = b.id
        WHERE a.office_id = :office_id
          AND a.aaba_id = :aaba_id
        ORDER BY uid
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":office_id" => $office_id,
            ":aaba_id"   => $aaba_id
        ]);

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "users" => $users
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function VoucherByDateHandler() {

    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Read JSON POST body
    $input = json_decode(file_get_contents("php://input"), true);

    $office_id  = $input["office_id"] ?? "";
    $start_date = $input["start_date"] ?? "";
    $end_date   = $input["end_date"] ?? "";
    $user_ids   = $input["user_id"] ?? [];   // array

    if (!$office_id || !$start_date || !$end_date) {
        echo json_encode([
            "status" => false,
            "message" => "office_id, start_date and end_date are required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        /* =========================================================
           CASE 1: NO USER FILTER
        ========================================================= */
        if (!is_array($user_ids) || count($user_ids) === 0) {

            $sql = "
            SELECT
                a.id,
                a.month_id,
                a.edate_voucher,
                a.ndate_voucher,
                a.edate_transaction,
                a.ndate_transaction,
                a.sirshak_id,
                b.sirshak_name,
                a.fant_id,
                c.fant_name,
                a.napa_id,
                d.napa_name,
                a.voucherno,
                a.amount,
                a.created_by_user_id,
                e.nepname,
                a.deposited_by
            FROM voucher_details a
            INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
            INNER JOIN voucher_fant c ON a.fant_id = c.id
            INNER JOIN voucher_napa d ON a.napa_id = d.id AND a.office_id = d.office_id
            INNER JOIN voucher_users e ON e.id = a.created_by_user_id
            WHERE a.office_id = :office_id
              AND a.edate_transaction BETWEEN :start_date AND :end_date
            ORDER BY a.edate_transaction, a.ndate_transaction, a.voucherno
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ":office_id"  => $office_id,
                ":start_date" => $start_date,
                ":end_date"   => $end_date
            ]);

        }
        /* =========================================================
           CASE 2: FILTER BY USERS
        ========================================================= */
        else {

            // create placeholders (?, ?, ?)
            $placeholders = implode(',', array_fill(0, count($user_ids), '?'));

            $sql = "
            SELECT
                a.id,
                a.month_id,
                a.ndate_voucher,
                a.ndate_transaction,
                a.sirshak_id,
                b.sirshak_name,
                a.fant_id,
                c.fant_name,
                a.napa_id,
                d.napa_name,
                a.voucherno,
                a.amount,
                a.created_by_user_id,
                e.nepname,
                a.deposited_by
            FROM voucher_details a
            INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
            INNER JOIN voucher_fant c ON a.fant_id = c.id
            INNER JOIN voucher_napa d ON a.napa_id = d.id AND a.office_id = d.office_id
            INNER JOIN voucher_users e ON e.id = a.created_by_user_id
            WHERE a.office_id = ?
              AND a.created_by_user_id IN ($placeholders)
              AND a.edate_transaction BETWEEN ? AND ?
            ORDER BY a.edate_transaction, a.ndate_transaction, a.voucherno
            ";

            $params = array_merge(
                [$office_id],
                $user_ids,
                [$start_date, $end_date]
            );

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status"  => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "data"    => $data
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function MonthlistByAabaHandler() {

    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $input = json_decode(file_get_contents("php://input"), true);

    $office_id = $input["office_id"] ?? "";
    $aaba_id   = $input["aaba_id"]   ?? "";

    if (!$office_id || !$aaba_id) {
        echo json_encode([
            "status" => false,
            "message" => "office_id and aaba_id required"
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
          AND a.aaba_id   = :aaba_id
        ORDER BY b.month_order
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":office_id" => $office_id,
            ":aaba_id"   => $aaba_id
        ]);

        $months = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status"  => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "months"  => $months
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function FantlistByAabaMonthHandler() {

    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $input = json_decode(file_get_contents("php://input"), true);

    $office_id = $input["office_id"] ?? "";
    $aaba_id   = $input["aaba_id"]   ?? "";
    $month_ids = $input["month_id"]  ?? [];   // array

    if (!$office_id || !$aaba_id || !is_array($month_ids) || count($month_ids) === 0) {
        echo json_encode([
            "status" => false,
            "message" => "office_id, aaba_id and month_id array required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        // create ?,?,? placeholders
        $placeholders = implode(',', array_fill(0, count($month_ids), '?'));

        $sql = "
        SELECT DISTINCT
            a.fant_id AS fid,
            b.fant_name AS fname,
            b.display_order
        FROM voucher_details a
        INNER JOIN voucher_fant b ON a.fant_id = b.id
        WHERE a.office_id = ?
          AND a.aaba_id   = ?
          AND a.month_id IN ($placeholders)
        ORDER BY b.display_order
        ";

        $params = array_merge(
            [$office_id, $aaba_id],
            $month_ids
        );

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $fants = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status"  => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "fants"   => $fants
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function UserlistByAabaMonthFantHandler() {

    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Read JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    $office_id = $input["office_id"] ?? "";
    $aaba_id   = $input["aaba_id"]   ?? "";
    $month_ids = $input["month_id"]  ?? [];
    $fant_ids  = $input["fant_id"]   ?? [];

    // Validation
    if (
        !$office_id || !$aaba_id ||
        !is_array($month_ids) || count($month_ids) === 0 ||
        !is_array($fant_ids)  || count($fant_ids) === 0
    ) {
        echo json_encode([
            "status" => false,
            "message" => "office_id, aaba_id, month_id[] and fant_id[] required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        // Create placeholders
        $monthPlaceholders = implode(',', array_fill(0, count($month_ids), '?'));
        $fantPlaceholders  = implode(',', array_fill(0, count($fant_ids), '?'));

        $sql = "
        SELECT DISTINCT
            a.created_by_user_id AS uid,
            b.nepname AS uname
        FROM voucher_details a
        INNER JOIN voucher_users b ON a.created_by_user_id = b.id
        WHERE a.office_id = ?
          AND a.aaba_id   = ?
          AND a.month_id IN ($monthPlaceholders)
          AND a.fant_id  IN ($fantPlaceholders)
        ORDER BY uid
        ";

        $params = array_merge(
            [$office_id, $aaba_id],
            $month_ids,
            $fant_ids
        );

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status"  => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "users"   => $users
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function voucherFantHandler() {
    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Read JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    $aaba_id   = $input["aaba_id"]   ?? "";
    $office_id = $input["office_id"] ?? "";
    $month_ids = $input["month_id"]  ?? [];
    $fant_ids  = $input["fant_id"]   ?? [];
    $user_ids  = $input["user_id"]   ?? [];

    // Validation
    if (
        !$aaba_id || !$office_id ||
        !is_array($month_ids) || count($month_ids) === 0 ||
        !is_array($fant_ids)  || count($fant_ids) === 0 ||
        !is_array($user_ids)  || count($user_ids) === 0
    ) {
        echo json_encode([
            "status" => false,
            "message" => "aaba_id, office_id, month_id[], fant_id[] and user_id[] required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        // Create placeholders
        $monthPH = implode(',', array_fill(0, count($month_ids), '?'));
        $fantPH  = implode(',', array_fill(0, count($fant_ids), '?'));
        $userPH  = implode(',', array_fill(0, count($user_ids), '?'));

        $sql = "
        SELECT
            a.aaba_id,
            a.office_id,
            a.month_id,
            d.month_name,
            d.month_order,
            a.fant_id,
            c.fant_name,
            a.sirshak_id,
            b.sirshak_name,
            e.acc_sirshak_name,
            b.display_order,
            SUM(a.amount) AS amount
        FROM voucher_details a
        INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
        INNER JOIN voucher_fant c ON a.fant_id = c.id
        INNER JOIN voucher_month d ON a.month_id = d.id
        INNER JOIN voucher_acc_sirshak e ON e.id = b.acc_sirshak_id
        WHERE a.aaba_id = ?
          AND a.office_id = ?
          AND a.fant_id IN ($fantPH)
          AND a.month_id IN ($monthPH)
          AND a.created_by_user_id IN ($userPH)
        GROUP BY
            a.aaba_id,
            a.office_id,
            a.month_id,
            a.fant_id,
            c.fant_name,
            a.sirshak_id
        ORDER BY
            d.month_order,
            a.fant_id,
            b.display_order
        ";

        $params = array_merge(
            [$aaba_id, $office_id],
            $fant_ids,
            $month_ids,
            $user_ids
        );

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status"  => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "data"    => $data
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}

function VoucherpalikaHandler() {

    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Read JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    $aaba_id    = $input["aaba_id"]    ?? "";
    $office_id  = $input["office_id"]  ?? "";
    $start_date = $input["start_date"] ?? "";
    $end_date   = $input["end_date"]   ?? "";

    // Validation
    if (!$aaba_id || !$office_id || !$start_date || !$end_date) {
        echo json_encode([
            "status" => false,
            "message" => "aaba_id, office_id, start_date and end_date are required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        $sql = "
        SELECT
            a.aaba_id,
            a.office_id,
            b.acc_sirshak_id,
            c.acc_sirshak_name,
            a.napa_id,
            d.napa_name,
            SUM(a.amount) AS amount
        FROM voucher_details a
        INNER JOIN voucher_sirshak b ON a.sirshak_id = b.id
        INNER JOIN voucher_acc_sirshak c ON b.acc_sirshak_id = c.id
        INNER JOIN voucher_napa d ON d.id = a.napa_id AND a.office_id = d.office_id
        WHERE a.aaba_id = :aaba_id
          AND a.office_id = :office_id
          AND a.edate_transaction BETWEEN :start_date AND :end_date
        GROUP BY
            a.aaba_id,
            a.office_id,
            b.acc_sirshak_id,
            a.napa_id,
            d.napa_name
        ORDER BY
            a.aaba_id,
            a.office_id,
            b.acc_sirshak_id,
            a.napa_id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":aaba_id"    => $aaba_id,
            ":office_id"  => $office_id,
            ":start_date" => $start_date,
            ":end_date"   => $end_date
        ]);

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status"  => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "data"    => $data
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getVoucherMasterHandler() {
    header("Content-Type: application/json; charset=utf-8");
    $pdo = getPDO();
    if (!$pdo) {
        echo json_encode([
            "status" => false,
            "message" => "Database unavailable"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $input = json_decode(file_get_contents("php://input"), true);
    $office_id = isset($input["office_id"]) ? trim($input["office_id"]) : "";

    if (!$office_id) {
        echo json_encode([
            "status" => false,
            "message" => "Office ID is required"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        // ----------- Voucher Sirshak -----------
        $stmt1 = $pdo->query("SELECT * FROM voucher_sirshak WHERE isactive=1 ORDER BY display_order");
        $sirshaks = $stmt1->fetchAll(PDO::FETCH_ASSOC);

        // ----------- Voucher Fant -----------
        $stmt2 = $pdo->prepare("SELECT * FROM voucher_fant WHERE isactive=1 AND office_id=:office_id ORDER BY display_order");
        $stmt2->execute([":office_id" => $office_id]);
        $fants = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        // ----------- Voucher Napa -----------
        $stmt3 = $pdo->prepare("SELECT * FROM voucher_napa WHERE isactive=1 AND office_id=:office_id ORDER BY display_order");
        $stmt3->execute([":office_id" => $office_id]);
        $napas = $stmt3->fetchAll(PDO::FETCH_ASSOC);

        // ----------- Voucher Parameters -----------
        $stmt4 = $pdo->prepare("SELECT office_id, vstart, vlength, CONCAT(vstart, vlength) AS parm FROM voucher_parameter WHERE office_id=:office_id AND isactive=1");
        $stmt4->execute([":office_id" => $office_id]);
        $params = $stmt4->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापूर्वक प्राप्त भयो",
            "data" => [
                "sirshaks" => $sirshaks,
                "fants" => $fants,
                "napas" => $napas,
                "params" => $params
            ]
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function addOrUpdateVoucherHandler() {
    header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST data
    $input = json_decode(file_get_contents("php://input"), true);

    // Assign variables safely
    $id                     = (int)($input["id"] ?? 0);
    $aaba_id                = $input["aaba_id"] ?? null;
    $office_id              = $input["office_id"] ?? null;
    $edate_voucher          = $input["edate_voucher"] ?? null;
    $ndate_voucher          = $input["ndate_voucher"] ?? null;
    $edate_transaction      = $input["edate_transaction"] ?? null;
    $ndate_transaction      = $input["ndate_transaction"] ?? null;
    $month_id               = $input["month_id"] ?? null;
    $sirshak_id             = $input["sirshak_id"] ?? null;
    $fant_id                = $input["fant_id"] ?? null;
    $napa_id                = $input["napa_id"] ?? null;
    $voucherno              = trim($input["voucherno"] ?? "");
    $amount                 = $input["amount"] ?? 0;
    $deposited_by           = strtoupper(trim($input["deposited_by"] ?? ""));
    $created_by_user_id     = $input["created_by_user_id"] ?? null;
    $client_ip              = $_SERVER["REMOTE_ADDR"] ?? "";

    if (!$voucherno || !$office_id || !$aaba_id) {
        echo json_encode([
            "status" => false,
            "message" => "आवश्यक विवरणहरू उपलब्ध छैनन् ।"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        /** ===============================
         * UPDATE VOUCHER
         * =============================== */
        if ($id > 0) {

            $sql = "
                UPDATE voucher_details SET
                    aaba_id = :aaba_id,
                    office_id = :office_id,
                    edate_voucher = :edate_voucher,
                    ndate_voucher = :ndate_voucher,
                    edate_transaction = :edate_transaction,
                    ndate_transaction = :ndate_transaction,
                    month_id = :month_id,
                    sirshak_id = :sirshak_id,
                    fant_id = :fant_id,
                    napa_id = :napa_id,
                    voucherno = :voucherno,
                    amount = :amount,
                    updated_by_user_id = :updated_by_user_id,
                    deposited_by = :deposited_by,
                    updated_by_ip = :updated_by_ip
                WHERE id = :id
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ":aaba_id" => $aaba_id,
                ":office_id" => $office_id,
                ":edate_voucher" => $edate_voucher,
                ":ndate_voucher" => $ndate_voucher,
                ":edate_transaction" => $edate_transaction,
                ":ndate_transaction" => $ndate_transaction,
                ":month_id" => $month_id,
                ":sirshak_id" => $sirshak_id,
                ":fant_id" => $fant_id,
                ":napa_id" => $napa_id,
                ":voucherno" => $voucherno,
                ":amount" => $amount,
                ":updated_by_user_id" => $created_by_user_id,
                ":deposited_by" => $deposited_by,
                ":updated_by_ip" => $client_ip,
                ":id" => $id
            ]);

            echo json_encode([
                "status" => true,
                "message" => "भौचर नं {$voucherno} सफलतापुर्वक संशोधन भयो ।"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        /** ===============================
         * CHECK DUPLICATE VOUCHER
         * =============================== */
        $checkSql = "
            SELECT a.*, b.nepname
            FROM voucher_details a
            INNER JOIN voucher_users b ON a.created_by_user_id = b.id
            WHERE a.office_id = :office_id
              AND a.aaba_id = :aaba_id
              AND a.voucherno = :voucherno
            LIMIT 1
        ";

        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([
            ":office_id" => $office_id,
            ":aaba_id" => $aaba_id,
            ":voucherno" => $voucherno
        ]);

        $exists = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($exists) {
            echo json_encode([
                "status" => false,
                "message" => "भौचर नं {$voucherno} मितिः {$exists['ndate_voucher']} मा {$exists['nepname']} बाट दर्ता भईसकेको छ ।"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        /** ===============================
         * INSERT VOUCHER
         * =============================== */
        $insertSql = "
            INSERT INTO voucher_details (
                aaba_id, office_id,
                edate_voucher, ndate_voucher,
                edate_transaction, ndate_transaction,
                month_id, sirshak_id, fant_id, napa_id,
                voucherno, amount,
                deposited_by,
                created_by_user_id,
                created_by_ip
            ) VALUES (
                :aaba_id, :office_id,
                :edate_voucher, :ndate_voucher,
                :edate_transaction, :ndate_transaction,
                :month_id, :sirshak_id, :fant_id, :napa_id,
                :voucherno, :amount,
                :deposited_by,
                :created_by_user_id,
                :created_by_ip
            )
        ";

        $stmt = $pdo->prepare($insertSql);
        $stmt->execute([
            ":aaba_id" => $aaba_id,
            ":office_id" => $office_id,
            ":edate_voucher" => $edate_voucher,
            ":ndate_voucher" => $ndate_voucher,
            ":edate_transaction" => $edate_transaction,
            ":ndate_transaction" => $ndate_transaction,
            ":month_id" => $month_id,
            ":sirshak_id" => $sirshak_id,
            ":fant_id" => $fant_id,
            ":napa_id" => $napa_id,
            ":voucherno" => $voucherno,
            ":amount" => $amount,
            ":deposited_by" => $deposited_by,
            ":created_by_user_id" => $created_by_user_id,
            ":created_by_ip" => $client_ip
        ]);

        echo json_encode([
            "status" => true,
            "message" => "भौचर नं {$voucherno} सफलतापुर्वक दर्ता भयो ।"
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function listUsersHandler() {
    header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST data
    $input = json_decode(file_get_contents("php://input"), true);

    $role_id   = $input["role_id"] ?? null;
    $office_id = $input["office_id"] ?? null;

    if (!$role_id) {
        echo json_encode([
            "status" => false,
            "message" => "Role ID उपलब्ध छैन ।"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        /** ===============================
         * ROLE BASED QUERY
         * =============================== */
        if ((int)$role_id === 1) {

            // role_id = 1 → fetch role = 2 users (all offices)
            $sql = "
                SELECT a.*, b.office_name
                FROM voucher_users a
                INNER JOIN voucher_offices b ON a.office_id = b.id
                WHERE a.role = 2
                ORDER BY a.office_id
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute();

        } elseif ((int)$role_id === 2) {

            // role_id = 2 → fetch role = 3 users (same office only)
            if (!$office_id) {
                echo json_encode([
                    "status" => false,
                    "message" => "कार्यालय आईडी आवश्यक छ ।"
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            $sql = "
                SELECT a.*, b.office_name
                FROM voucher_users a
                INNER JOIN voucher_offices b ON a.office_id = b.id
                WHERE a.role = 3
                  AND a.office_id = :office_id
                ORDER BY a.office_id
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ":office_id" => $office_id
            ]);

        } else {

            echo json_encode([
                "status" => false,
                "message" => "अनुमति नभएको भूमिका (Role) ।"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "data" => $users
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}

function changeUserStatusHandler() {
    header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $input = json_decode(file_get_contents("php://input"), true);

    $status             = $input["status"] ?? null;
    $updated_by_user_id = $input["updated_by_user_id"] ?? null;
    $user_id            = $input["user_id"] ?? null;

    if ($status === null || !$updated_by_user_id || !$user_id) {
        echo json_encode([
            "status" => false,
            "message" => "आवश्यक विवरणहरू उपलब्ध छैनन् ।"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Toggle status
    $newStatus = ((int)$status === 1) ? 0 : 1;

    try {
        $sql = "
            UPDATE voucher_users 
            SET isactive = :isactive,
                updated_by_user_id = :updated_by_user_id
            WHERE id = :id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":isactive" => $newStatus,
            ":updated_by_user_id" => $updated_by_user_id,
            ":id" => $user_id
        ]);

        echo json_encode([
            "status" => true,
            "message" => "प्रयोगकर्ता सफलतापुर्वक संशोधन भयो",
            "data" => [
                "user_id" => $user_id,
                "new_status" => $newStatus
            ]
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function resetPasswordHandler() {
    header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $input = json_decode(file_get_contents("php://input"), true);

    $updated_by_user_id = $input["updated_by_user_id"] ?? null;
    $user_id            = $input["user_id"] ?? null;

    if (!$updated_by_user_id || !$user_id) {
        echo json_encode([
            "status" => false,
            "message" => "आवश्यक विवरणहरू उपलब्ध छैनन् ।"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    $newPassword = "Admin@123$";
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);

    try {
        $sql = "
            UPDATE voucher_users 
            SET password = :password,
                updated_by_user_id = :updated_by_user_id
            WHERE id = :id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":password" => $hash,
            ":updated_by_user_id" => $updated_by_user_id,
            ":id" => $user_id
        ]);

        echo json_encode([
            "status" => true,
            "message" => "प्रयोगकर्ताको पासवर्ड {$newPassword} अपडेट भयो",
            "data" => [
                "user_id" => $user_id
            ]
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function listStatesHandler() {
    header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    try {

        $sql = "SELECT * FROM voucher_state";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        $states = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "प्रदेशहरु सफलतापुर्वक प्राप्त भयो",
            "states" => $states
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function listBadhfandByStatesHandler() {
    header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $input = json_decode(file_get_contents("php://input"), true);

    $aaba_id  = $input["aaba_id"] ?? null;
    $state_id = $input["state_id"] ?? [];

    if (!$aaba_id || !is_array($state_id)) {
        echo json_encode([
            "status" => false,
            "message" => "आवश्यक विवरण उपलब्ध छैन ।"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {

        /** ===============================
         * BUILD IN CLAUSE SAFELY
         * =============================== */
        if (count($state_id) > 0) {
            // ?,?,? placeholders
            $placeholders = implode(",", array_fill(0, count($state_id), "?"));
            $whereState   = "a.state_id IN ($placeholders)";
            $params       = array_merge([$aaba_id], $state_id);
        } else {
            // No state selected → return empty
            $whereState = "a.state_id IN (0)";
            $params     = [$aaba_id];
        }

        $sql = "
            SELECT 
                a.*,
                b.state_name,
                c.aaba_name,
                d.acc_sirshak_name
            FROM voucher_badhfadh a
            INNER JOIN voucher_state b ON a.state_id = b.id
            INNER JOIN voucher_aabas c ON a.aaba_id = c.id
            INNER JOIN voucher_acc_sirshak d ON a.acc_sirshak_id = d.id
            WHERE a.aaba_id = ?
              AND $whereState
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापुर्वक प्राप्त भयो",
            "data" => $results
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function listOfficesByStatesHandler() {
    header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $input = json_decode(file_get_contents("php://input"), true);

    $state_id = $input["state_id"] ?? [];

    if (!is_array($state_id)) {
        echo json_encode([
            "status" => false,
            "message" => "state_id array उपलब्ध छैन ।"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        // Build IN clause safely
        if (count($state_id) > 0) {
            $placeholders = implode(",", array_fill(0, count($state_id), "?"));
            $whereState = "a.state_id IN ($placeholders)";
            $params = $state_id;
        } else {
            $whereState = "a.state_id IN (0)";
            $params = [];
        }

        $sql = "
            SELECT a.*, b.state_name
            FROM voucher_offices a
            INNER JOIN voucher_state b ON a.state_id = b.id
            WHERE $whereState
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $offices = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "कार्यालयहरु सफलतापुर्वक प्राप्त भयो",
            "offices" => $offices
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function updateStateOfOfficeHandler() {
    header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $input = json_decode(file_get_contents("php://input"), true);
    $state_id         = $input["state_id"] ?? null;
    $isvoucherchecked = $input["isvoucherchecked"] ?? null;
    $isvoucherenabled = $input["isvoucherenabled"] ?? null;
    $usenepcalendar= $input["usenepcalendar"] ?? null;
    $expire_at=$input["expire_at"] ?? null;
    $id = $input["id"] ?? null;

    if ($state_id === null || $isvoucherenabled===null ||$usenepcalendar===null || $isvoucherchecked === null || $id === null ) {
        echo json_encode([
            "status" => false,
            "message" => "आवश्यक विवरण उपलब्ध छैन ।"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        $sql = "
            UPDATE voucher_offices
            SET state_id = :state_id,
            isvoucherchecked = :isvoucherchecked,
            isvoucherenabled = :isvoucherenabled,
            usenepcalendar = :usenepcalendar,
            expire_at = :expire_at
            WHERE id = :id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":state_id" => $state_id,
            ":isvoucherchecked" => $isvoucherchecked,
            ":isvoucherenabled" => $isvoucherenabled,
            ":usenepcalendar" =>$usenepcalendar,
            ":expire_at" =>$expire_at,
            ":id" => $id
        ]);

        echo json_encode([
            "status" => true,
            "message" => "डाटा सफलतापुर्वक संशोधन भयो",
            "data" => [
                "id" => $id,
                "state_id" => $state_id,
                "isvoucherchecked" => $isvoucherchecked,

            ]
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function changePasswordHandler(){
 header("Content-Type: application/json; charset=utf-8");

    $pdo = getPDO();
if (!$pdo) return dbUnavailable("Remote");
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$user_id     = $input['user_id'] ?? null;
$oldpassword = $input['oldpassword'] ?? null;
$newpassword = $input['newpassword'] ?? null;

if (!$user_id || !$oldpassword || !$newpassword) {
    http_response_code(400);
    echo json_encode(["message" => "अनावश्यक डाटा हराइरहेको छ।"]);
    exit;
}

try {
    // Fetch user
    $stmt = $pdo->prepare("SELECT * FROM voucher_users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(400);
        echo json_encode(["message" => "गलत प्रयोगकर्ता द्वारा प्रयास गरिएको।"]);
        exit;
    }

    // Verify old password
    if (!password_verify($oldpassword, $user['password'])) {
        echo json_encode(["message" => "गलत पुरानो पासवर्ड।"]);
        exit;
    }

    // Hash new password
    $hashedNewPassword = password_hash($newpassword, PASSWORD_BCRYPT);

    // Update password
    $stmt = $pdo->prepare("UPDATE voucher_users SET password = ? WHERE id = ?");
    $stmt->execute([$hashedNewPassword, $user_id]);

    echo json_encode(["status" => true, "message" => "पासवर्ड परिवर्तन सफल भयो।"]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "सर्भर त्रुटि भयो", "error" => $e->getMessage()]);
}
}
function notFound() { http_response_code(404); echo json_encode(["status"=>false,"message"=>"Not Found"]); exit(); }
function methodNotAllowed() { http_response_code(405); echo json_encode(["status"=>false,"message"=>"Method Not Allowed"]); exit(); }
function respondDbError($e) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"Database Error","error"=>$e->getMessage()]); exit(); }
function dbUnavailable($type) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"$type database not available"]); exit(); }
function invalidInput($field) { http_response_code(400); echo json_encode(["status"=>false,"message"=>"Invalid input: $field"]); exit(); }
?>
