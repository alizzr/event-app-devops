<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h2 style="color: #3b82f6;">Bienvenue, {{ $name }} !</h2>
        <p>Merci de vous être inscrit. Pour activer votre compte et accéder à votre dashboard, veuillez cliquer ci-dessous :</p>
        <br>
        <a href="{{ $link }}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Vérifier mon Email
        </a>
        <br><br>
        <p style="color: #888; font-size: 12px;">Si le bouton ne fonctionne pas, copiez ce lien : {{ $link }}</p>
    </div>
</body>
</html>