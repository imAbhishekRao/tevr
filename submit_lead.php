<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit();
}

// Validate required fields
$required_fields = ['name', 'email', 'phoneNumber'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

// Extract and format data
$name = trim($input['name']);
$email = trim($input['email']);
$phone = trim($input['phoneNumber']);
$phoneCode = isset($input['phoneCode']) ? trim($input['phoneCode']) : '+91';

// Split name into first and last name
$name_parts = explode(' ', $name, 2);
$f_name = $name_parts[0];
$l_name = isset($name_parts[1]) ? $name_parts[1] : '';

// Determine project based on form type or property type
$project = 'Trifecta Verde En Resplandor Villa Phase 3';
if (isset($input['propertyType'])) {
    if ($input['propertyType'] === 'villaments' || $input['propertyType'] === 'rowhomes') {
        $project = 'Trifecta Verde En Resplandor Row Homes Phase 3';
    }
}

// Create notes based on available data
$notes = "Lead from website form";
if (isset($input['date']) && isset($input['time'])) {
    $notes .= " - Requested site visit on " . $input['date'] . " at " . $input['time'];
}
if (isset($input['propertyType'])) {
    $notes .= " - Interested in " . $input['propertyType'];
}
if (isset($input['formType'])) {
    $notes .= " - Form type: " . $input['formType'];
}

// Prepare data for Paramantra API
$paramantra_data = array(
    'rep_id' => 'vijayan.p@trifectaprojects.com',
    'channel_id' => 'Google_TVER',
    'subject' => 'Lead from Google_TVER',
    'f_name' => $f_name,
    'l_name' => $l_name,
    'email' => $email,
    'phonefax' => $phoneCode . $phone,
    'notes' => $notes,
    'project' => $project,
    'alert_client' => 0,
    'alert_rep' => 0
);

// API configuration
$url = 'https://cloud.paramantra.com/paramantra/api/data/new/format/json';
$api_key = 'JGLx6DFJ5v5sCB42FoGAMMEyFv';
$app_name = '2qDDs';

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "X-API-KEY: $api_key",
    "ACTION-ON: $app_name"
));
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($paramantra_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
curl_setopt($ch, CURLOPT_USERPWD, $api_key);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

// Execute the request
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// Handle cURL errors
if ($curl_error) {
    error_log("cURL Error: " . $curl_error);
    http_response_code(500);
    echo json_encode(['error' => 'Failed to submit lead. Please try again.']);
    exit();
}

// Handle HTTP errors
if ($http_code !== 200) {
    error_log("API Error: HTTP $http_code - $response");
    http_response_code(500);
    echo json_encode(['error' => 'Failed to submit lead. Please try again.']);
    exit();
}

// Parse response
$response_data = json_decode($response, true);

// Since we got HTTP 200, consider it successful
// Log the response for debugging
error_log("API Response: " . $response);
error_log("Parsed Response Data: " . print_r($response_data, true));

// For now, let's always return success to test if the JavaScript works
echo json_encode(['message' => 'Lead submitted successfully!']);
?>


