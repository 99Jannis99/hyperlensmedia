<?php
header('Content-Type: application/json');

// Aktiviere Error Reporting für Debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Debug Log Funktion
    function debug_log($message, $data = null) {
        error_log(print_r($message, true));
        if ($data !== null) {
            error_log(print_r($data, true));
        }
    }

    debug_log("Starting form processing...");

    // Hole die E-Mail-Adresse aus der Supabase-Datenbank über die REST API
    $SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4a3V3eHFocnllaWZwd2Fkc2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Mzg5MTUsImV4cCI6MjA1MjQxNDkxNX0.iYtuUZqZrxR8jXuiMhoi_Y8x-BeZMdaHKV5uFF4XktU';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://fxkuwxqhryeifpwadsio.supabase.co/rest/v1/settings?select=value&key=eq.contact_email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $SUPABASE_KEY,
        'Authorization: Bearer ' . $SUPABASE_KEY,
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    debug_log("Supabase Response:", $response);
    debug_log("HTTP Code:", $httpCode);
    
    if (curl_errno($ch)) {
        debug_log("Curl Error:", curl_error($ch));
    }
    
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception('Error loading email address (HTTP ' . $httpCode . ')');
    }

    $data = json_decode($response, true);
    debug_log("Decoded Data:", $data);

    if (!$data || !isset($data[0]['value'])) {
        throw new Exception('No email address found in database');
    }

    $to_email = $data[0]['value'];
    debug_log("Target Email Address:", $to_email);

    // Formulardaten verarbeiten
    $firstname = $_POST['Contact-4-First-Name'] ?? '';
    $lastname = $_POST['Contact-4-Last-Name'] ?? '';
    $email = $_POST['Contact-4-Email'] ?? '';
    $phone = $_POST['Contact-4-Phone'] ?? '';
    $topic = $_POST['Contact-4-Select'] ?? '';

    // Übersetze die Themen
    $topic_translations = [
        'First' => 'FPV Pilot Booking',
        'Second' => 'Build new Copter',
        'Third' => 'Repair Copter',
        'Fourth' => 'Tune Copter'
    ];
    
    $translated_topic = $topic_translations[$topic] ?? $topic;
    $message = $_POST['Contact-2-Message-2'] ?? '';

    debug_log("Form Data:", $_POST);

    // E-Mail zusammenstellen
    $subject = "New Contact Request: $translated_topic";
    $email_content = "
        New contact form submission:
        
        Name: $firstname $lastname
        Email: $email
        Phone: $phone
        Topic: $translated_topic
        
        Message:
        $message
        
        Best regards,
        Your Contact Form System
    ";

    $headers = [
        'From' => $email,
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=utf-8'
    ];

    debug_log("Attempting to send email to:", $to_email);
    debug_log("With content:", $email_content);

    // E-Mail senden
    $mail_sent = mail($to_email, $subject, $email_content, $headers);
    debug_log("Mail sent result:", $mail_sent);

    if ($mail_sent) {
        $response_data = [
            'success' => true,
            'message' => 'Your message has been sent successfully!',
            'sent_to' => $to_email
        ];
        debug_log("Successful response:", $response_data);
        echo json_encode($response_data);
    } else {
        throw new Exception('Failed to send email');
    }

} catch (Exception $e) {
    debug_log("Error occurred:", $e->getMessage());
    
    $error_response = [
        'success' => false,
        'message' => 'There was an error sending your message. Please try again later.',
        'error' => $e->getMessage()
    ];
    debug_log("Error response:", $error_response);
    echo json_encode($error_response);
} 