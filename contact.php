<?php
// contact.php  (or api/contact.php)

header('Content-Type: application/json');

// CORS (so it also works from Vercel preview)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Method not allowed"
    ]);
    exit;
}

// Read JSON or fallback to form-data
$rawBody = file_get_contents("php://input");
$data = json_decode($rawBody, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    // fallback to normal POST
    $data = $_POST;
}

$name    = trim($data['name']    ?? '');
$email   = trim($data['email']   ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');

// Basic validation
if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Name, email and message are required."
    ]);
    exit;
}

// ---- Email sending ----

$to = "inof@votivemanagement.com"; // 👉 change this to your email

$emailSubject = $subject
    ? "Votive website: $subject"
    : "New contact form submission from Votive website";

$body  = "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Subject: " . ($subject ?: 'N/A') . "\n\n";
$body .= "Message:\n$message\n";

$headers  = "From: Votive Website <no-reply@votivemanagement.com>\r\n"; // you can change domain
$headers .= "Reply-To: $email\r\n";

$sent = mail($to, $emailSubject, $body, $headers);

if ($sent) {
    echo json_encode([
        "success" => true,
        "message" => "Message sent successfully."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Failed to send email."
    ]);
}
