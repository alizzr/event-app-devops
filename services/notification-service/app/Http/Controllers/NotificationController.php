<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\GenericNotification;

class NotificationController extends Controller
{
    public function send(Request $request)
    {
        $type = $request->type ?? 'generic'; // 'verify', 'ticket', ou 'generic'

        try {
            Mail::send([], [], function ($message) use ($request, $type) {
                $message->to($request->email)
                        ->subject($request->subject);

                // Génération du contenu HTML selon le type
                if ($type === 'verify') {
                    $html = view('emails.verification', [
                        'name' => $request->name, 
                        'link' => $request->link
                    ])->render();
                } elseif ($type === 'ticket') {
                    $html = view('emails.ticket', [
                        'event_title' => $request->event_title,
                        'event_date' => $request->event_date,
                        'user_name' => $request->user_name,
                        'booking_id' => $request->booking_id
                    ])->render();
                } else {
                    $html = "<h1>Notification</h1><p>" . $request->message . "</p>";
                }

                $message->html($html);
            });

            return response()->json(['message' => 'Email envoyé via Gmail']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}