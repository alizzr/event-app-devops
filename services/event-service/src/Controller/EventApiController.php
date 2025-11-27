<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class EventApiController extends AbstractController
{
    #[Route('/event/api', name: 'app_event_api')]
    public function index(): Response
    {
        return $this->render('event_api/index.html.twig', [
            'controller_name' => 'EventApiController',
        ]);
    }
// services/event-service/src/Controller/EventApiController.php

#[Route('/api/events/{id}/decrement_places', name: 'event_decrement', methods: ['PATCH'])]
public function decrementPlaces(int $id, Request $request, EntityManagerInterface $em): Response
{
    // --- VÉRIFICATION D'AUTORISATION ---
    // Pour une communication service-to-service, on vérifie que l'appel vient
    // d'un service de confiance (ex: un token JWT spécial pour les microservices)
    // Pour l'instant, nous simulerons en vérifiant l'Admin Role du token reçu.
    // $this->denyAccessUnlessGranted('ROLE_ADMIN'); // Nécessite l'implémentation complète du JWT
    // ------------------------------------
    
    $event = $em->getRepository(Event::class)->find($id);

    if (!$event) {
        return new JsonResponse(['message' => 'Événement non trouvé'], 404);
    }
    
    $data = json_decode($request->getContent(), true);
    $decrementBy = $data['decrement_by'] ?? 1;

    if ($event->getPlaces() < $decrementBy) {
        return new JsonResponse(['message' => 'Stock insuffisant'], 409); // 409 Conflict
    }

    $event->setPlaces($event->getPlaces() - $decrementBy);
    $em->flush();

    return new JsonResponse(['message' => 'Stock décrémenté avec succès'], 200);
}
}
