<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #333; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #3b82f6; padding: 20px; color: white; text-align: center;">
            <h1>🎫 VOTRE TICKET</h1>
        </div>
        <div style="padding: 20px; border-bottom: 2px dashed #ccc;">
            <h2 style="margin: 0;">{{ $event_title }}</h2>
            <p style="color: #666;">Date : <strong>{{ $event_date }}</strong></p>
            <p>Détenteur : <strong>{{ $user_name }}</strong></p>
        </div>
        <div style="padding: 20px; text-align: center; background-color: #f9fafb;">
            <p style="font-size: 12px; color: #888;">ID Réservation : #{{ $booking_id }}</p>
            <div style="background: black; height: 40px; width: 80%; margin: 10px auto;"></div>
            <p style="font-size: 10px;">Présentez ce ticket à l'entrée</p>
        </div>
    </div>
</body>
</html>