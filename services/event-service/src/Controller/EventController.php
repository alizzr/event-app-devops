<?php

namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class EventController extends AbstractController
{
    // Helper Token
    private function getUserRoleFromToken(Request $request): ?string
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader) return null;
        $token = str_replace('Bearer ', '', $authHeader);
        $parts = explode('.', $token);
        if (count($parts) < 2) return null;
        $payload = json_decode(base64_decode($parts[1]), true);
        return $payload['role'] ?? null;
    }

    // --- 1. LISTE (GET) ---
    #[Route('/api/events', name: 'api_events_index', methods: ['GET'])]
// --- 1. LISTER LES ÉVÉNEMENTS (Uniquement les futurs) ---
    #[Route('/api/events', name: 'api_events_index', methods: ['GET'])]
    public function index(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $qb = $em->getRepository(Event::class)->createQueryBuilder('e');

            // --- MODIFICATION ICI : On ne veut que les événements FUTURS ---
            $qb->andWhere('e.date > :now')
               ->setParameter('now', new \DateTime()); // Date et heure actuelles
            // ---------------------------------------------------------------

            // Filtres existants (Search, Location, Date spécifique)
            if ($search = $request->query->get('search')) {
                $qb->andWhere('e.title LIKE :search OR e.description LIKE :search')
                   ->setParameter('search', '%' . $search . '%');
            }
            if ($loc = $request->query->get('location')) {
                $qb->andWhere('e.location LIKE :loc')->setParameter('loc', '%' . $loc . '%');
            }
            if ($date = $request->query->get('date')) {
                $qb->andWhere('e.date >= :date')->setParameter('date', new \DateTime($date));
            }

            $events = $qb->orderBy('e.date', 'ASC')->getQuery()->getResult();
            
            $data = [];
            foreach ($events as $event) {
                $data[] = [
                    'id' => $event->getId(),
                    'title' => $event->getTitle(),
                    'description' => $event->getDescription(),
                    'date' => $event->getDate()->format('Y-m-d H:i'),
                    'location' => $event->getLocation(),
                    'places' => $event->getPlaces(),
                    'price' => $event->getPrice(),
                    'image' => $event->getImage(),
                ];
            }

            return $this->json($data, 200, ['Access-Control-Allow-Origin' => '*']);

        } catch (\Throwable $e) {
            return $this->json(['error' => $e->getMessage()], 500, ['Access-Control-Allow-Origin' => '*']);
        }
    }

    // --- 2. CRÉER UN ÉVÉNEMENT (Validation Date) ---
    #[Route('/api/events', name: 'api_events_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        if ($this->getUserRoleFromToken($request) !== 'admin') {
            return $this->json(['message' => 'Forbidden'], 403, ['Access-Control-Allow-Origin' => '*']);
        }

        try {
            $dateStr = $request->request->get('date');
            $dateObject = new \DateTime($dateStr);

            // --- MODIFICATION ICI : Validation Date Future ---
            if ($dateObject < new \DateTime()) {
                return $this->json(['message' => 'Impossible de créer un événement dans le passé !'], 400, ['Access-Control-Allow-Origin' => '*']);
            }
            // -------------------------------------------------

            $event = new Event();
            $event->setTitle($request->request->get('title'));
            $event->setDescription($request->request->get('description') ?? '');
            $event->setDate($dateObject);
            $event->setLocation($request->request->get('location'));
            $event->setPlaces((int)$request->request->get('places'));
            $event->setPrice((float)$request->request->get('price'));
            $event->setUserId(1);

            $imageFile = $request->files->get('image');
            if ($imageFile) {
                $newFilename = uniqid() . '.' . $imageFile->guessExtension();
                $imageFile->move($this->getParameter('kernel.project_dir') . '/public/uploads', $newFilename);
                $event->setImage($newFilename);
            }

            $em->persist($event);
            $em->flush();

            return $this->json(['message' => 'Succès !'], 201, ['Access-Control-Allow-Origin' => '*']);
        } catch (\Throwable $e) {
            return $this->json(['error' => $e->getMessage()], 500, ['Access-Control-Allow-Origin' => '*']);
        }
    }
    // --- 3. SUPPRESSION (DELETE) ---
    #[Route('/api/events/{id}', name: 'api_events_delete', methods: ['DELETE', 'OPTIONS'])]
    public function delete(int $id, EntityManagerInterface $em, Request $request): JsonResponse
    {
        if ($request->isMethod('OPTIONS')) {
            return $this->json([], 200, ['Access-Control-Allow-Origin' => '*', 'Access-Control-Allow-Methods' => 'DELETE, OPTIONS']);
        }

        if ($this->getUserRoleFromToken($request) !== 'admin') return $this->json(['message' => 'Forbidden'], 403, ['Access-Control-Allow-Origin' => '*']);

        $event = $em->getRepository(Event::class)->find($id);
        if (!$event) return $this->json(['message' => 'Not found'], 404, ['Access-Control-Allow-Origin' => '*']);

        if ($event->getImage()) @unlink($this->getParameter('kernel.project_dir') . '/public/uploads/' . $event->getImage());
        
        $em->remove($event);
        $em->flush();

        return $this->json(['message' => 'Deleted'], 200, ['Access-Control-Allow-Origin' => '*']);
    }

    // --- 4. DÉCRÉMENTER (Interne) ---
    #[Route('/api/events/{id}/decrement', name: 'api_events_decrement', methods: ['POST'])]
    public function decrementPlaces(int $id, EntityManagerInterface $em): JsonResponse
    {
        $event = $em->getRepository(Event::class)->find($id);
        if (!$event) return $this->json(['message' => 'Not found'], 404);

        if ($event->getPlaces() > 0) {
            $event->setPlaces($event->getPlaces() - 1);
            $em->flush();
            return $this->json(['success' => true]);
        }
        return $this->json(['message' => 'Sold out'], 409);
    }
}