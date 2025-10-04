<?php
// Simple test file to verify the lead submission works
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test Lead Submission</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input, select { padding: 8px; width: 300px; }
        button { padding: 10px 20px; background: #69BC8A; color: white; border: none; cursor: pointer; }
        .result { margin-top: 20px; padding: 10px; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <h1>Test Lead Submission</h1>
    
    <form id="testForm">
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" value="Test User" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="test@example.com" required>
        </div>
        
        <div class="form-group">
            <label for="phoneCode">Phone Code:</label>
            <select id="phoneCode" name="phoneCode">
                <option value="+91">+91</option>
                <option value="+1">+1</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="phoneNumber">Phone Number:</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value="9876543210" required>
        </div>
        
        <div class="form-group">
            <label for="propertyType">Property Type:</label>
            <select id="propertyType" name="propertyType">
                <option value="villas">Villas</option>
                <option value="rowhomes">Row Homes</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="formType">Form Type:</label>
            <select id="formType" name="formType">
                <option value="brochure_download">Brochure Download</option>
                <option value="site_visit_booking">Site Visit Booking</option>
            </select>
        </div>
        
        <button type="submit">Test Submit Lead</button>
    </form>
    
    <div id="result"></div>

    <script>
        document.getElementById('testForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phoneCode: document.getElementById('phoneCode').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                propertyType: document.getElementById('propertyType').value,
                formType: document.getElementById('formType').value
            };
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>Submitting...</p>';
            
            fetch('submit_lead.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    resultDiv.innerHTML = '<div class="result success">Success: ' + data.message + '</div>';
                } else {
                    resultDiv.innerHTML = '<div class="result error">Error: ' + (data.error || 'Unknown error') + '</div>';
                }
            })
            .catch(error => {
                resultDiv.innerHTML = '<div class="result error">Network Error: ' + error.message + '</div>';
            });
        });
    </script>
</body>
</html>



