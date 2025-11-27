<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
       // LISTER TOUS LES UTILISATEURS
    public function index()
    {
        // Sécurité : Seul un admin peut voir la liste
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return response()->json(User::all());
    }

    // VOIR UN SEUL UTILISATEUR
    public function show($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Utilisateur introuvable'], 404);

        return response()->json($user);
    }

    // MODIFIER LE RÔLE (Promouvoir Admin / Rétrograder)
    public function updateRole(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Utilisateur introuvable'], 404);

        // On valide que le rôle est soit 'admin' soit 'user'
        $request->validate([
            'role' => 'required|in:admin,user'
        ]);

        // Protection : On empêche de modifier son propre rôle pour ne pas se bloquer
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Vous ne pouvez pas modifier votre propre rôle'], 400);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Rôle mis à jour avec succès', 'user' => $user]);
    }

    // SUPPRIMER UN UTILISATEUR
    public function destroy($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Utilisateur introuvable'], 404);

        // Protection : On empêche de se supprimer soi-même
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}