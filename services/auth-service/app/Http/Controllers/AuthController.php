<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Routing\Controller;

class AuthController extends Controller
{
    /**
     * Constructeur : Appliquer le middleware 'auth:api' sauf pour le login et register
     */
   public function __construct()
    {
        // On protège tout SAUF : login, register ET verifyEmail
        $this->middleware('auth:api', ['except' => ['login', 'register', 'verifyEmail']]);
    }

   /**
     * Inscription avec validation stricte
     */
// Remplacez la méthode REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Générer un token unique
        $token = \Illuminate\Support\Str::random(60);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'verification_token' => $token,
            'is_verified' => false // Pas actif au début
        ]);

        // Appel au Service Notification pour envoyer le lien
        // Le lien pointe vers le Frontend React qui traitera la vérification
        $verifyLink = "http://localhost:5173/verify-email?token=" . $token;

        try {
            $client = new \GuzzleHttp\Client();
            $client->post('http://notification-service:80/api/send-email', [
                'json' => [
                    'type' => 'verify',
                    'email' => $user->email,
                    'subject' => 'Activez votre compte Event App',
                    'name' => $user->name,
                    'link' => $verifyLink
                ]
            ]);
        } catch (\Exception $e) { /* Log error */ }

        return response()->json([
            'status' => 'success',
            'message' => 'Compte créé ! Veuillez vérifier vos emails pour activer.',
        ], 201);
    }

    // Remplacez la méthode LOGIN (pour empêcher la connexion si non vérifié)
public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        
        $credentials = $request->only('email', 'password');

        // --- CORRECTION ICI : On force le guard 'api' pour avoir le TOKEN ---
        $token = auth('api')->attempt($credentials);
        // --------------------------------------------------------------------

        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Identifiants incorrects',
            ], 401);
        }

        $user = auth('api')->user(); // On récupère l'user via le guard api

        // Vérification email
        if (!$user->is_verified) {
            auth('api')->logout();
            return response()->json([
                'status' => 'error',
                'message' => 'Veuillez vérifier votre email avant de vous connecter.'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'authorisation' => [
                'token' => $token, // Cette fois, ce sera une chaîne de caractères !
                'type' => 'bearer',
            ]
        ]);
    }
    // Ajoutez la nouvelle méthode VERIFY
    public function verifyEmail(Request $request)
    {
        $token = $request->token;
        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Token invalide'], 400);
        }

        // On valide le user
        $user->is_verified = true;
        $user->verification_token = null; // On vide le token
        $user->save();

        // On le connecte directement !
        $jwt = Auth::login($user);

        return response()->json([
            'message' => 'Compte vérifié avec succès !',
            'token' => $jwt, // On renvoie le token pour que le front connecte l'user
            'user' => $user
        ]);
    }
    /**
     * Récupérer le profil de l'utilisateur connecté (Me)
     */
    public function me()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(), // Retourne les infos de l'utilisateur authentifié par le token
        ]);
    }

    /**
     * Déconnexion (Invalide le token)
     */
    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Déconnecté avec succès',
        ]);
    }

    /**
     * Rafraîchir le token (obtenir un nouveau token valide)
     */
    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }
}