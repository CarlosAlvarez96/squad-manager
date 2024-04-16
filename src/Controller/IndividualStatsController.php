<?php

namespace App\Controller;

use App\Entity\IndividualStats;
use App\Repository\IndividualStatsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;


#[Route('/individual-stats', name: 'app_individual_stats')]
class IndividualStatsController extends AbstractController
{
    #[Route('/all', name: 'individual_stats_all', methods: ['GET'])]
    public function getAllIndividualStats(IndividualStatsRepository $individualStatsRepository): JsonResponse
    {
        // Obtiene todos los registros de IndividualStats
        $individualStats = $individualStatsRepository->findAll();

        // Formatea los datos de los registros para la respuesta
        $formattedStats = [];
        foreach ($individualStats as $stats) {
            $formattedStats[] = [
                'id' => $stats->getId(),
                'pace' => $stats->getPace(),
                'shooting' => $stats->getShooting(),
                'physical' => $stats->getPhysical(),
                'defending' => $stats->getDefending(),
                'dribbling' => $stats->getDribbling(),
                'passing' => $stats->getPassing(),
                'position' => $stats->getPosition(),
                'user_id' => $stats->getUser() ? $stats->getUser()->getId() : null,
            ];
        }

        // Devuelve una respuesta JSON con todos los registros de IndividualStats
        return new JsonResponse($formattedStats);
    }

    #[Route('/create', name: 'individual_stats_create', methods: ['POST'])]
    public function createIndividualStats(Request $request, EntityManagerInterface $entityManager): Response
    {
        // Obtiene los datos del cuerpo de la solicitud
        $data = json_decode($request->getContent(), true);

        // Crea una nueva instancia de la entidad IndividualStats
        $stats = new IndividualStats();
        $stats->setPace($data['pace'] ?? null);
        $stats->setShooting($data['shooting'] ?? null);
        $stats->setPhysical($data['physical'] ?? null);
        $stats->setDefending($data['defending'] ?? null);
        $stats->setDribbling($data['dribbling'] ?? null);
        $stats->setPassing($data['passing'] ?? null);
        $stats->setPosition($data['position'] ?? null);

        // Verifica si se proporcionó un ID de usuario y lo asocia si es así
        if (isset($data['user_id'])) {
            $user = $entityManager->getRepository(User::class)->find($data['user_id']);
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }
            $stats->setUser($user);
        }

        // Guarda las estadísticas individuales en la base de datos
        $entityManager->persist($stats);
        $entityManager->flush();

        // Devuelve una respuesta de éxito
        return new JsonResponse(['message' => 'IndividualStats created successfully'], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'individual_stats_get', methods: ['GET'])]
    public function getIndividualStatsById(int $id, IndividualStatsRepository $individualStatsRepository): JsonResponse
    {
        // Busca las estadísticas individuales por su ID
        $stats = $individualStatsRepository->find($id);

        // Verifica si las estadísticas individuales existen
        if (!$stats) {
            return new JsonResponse(['error' => 'IndividualStats not found'], Response::HTTP_NOT_FOUND);
        }

        // Formatea los datos de las estadísticas individuales para la respuesta
        $formattedStats = [
            'id' => $stats->getId(),
            'pace' => $stats->getPace(),
            'shooting' => $stats->getShooting(),
            'physical' => $stats->getPhysical(),
            'defending' => $stats->getDefending(),
            'dribbling' => $stats->getDribbling(),
            'passing' => $stats->getPassing(),
            'position' => $stats->getPosition(),
            'user_id' => $stats->getUser() ? $stats->getUser()->getId() : null,
        ];

        // Devuelve una respuesta JSON con las estadísticas individuales encontradas
        return new JsonResponse($formattedStats);
    }

    #[Route('/{id}', name: 'individual_stats_update', methods: ['PUT'])]
    public function updateIndividualStats(int $id, Request $request, EntityManagerInterface $entityManager): Response
    {
        // Obtiene los datos del cuerpo de la solicitud
        $data = json_decode($request->getContent(), true);

        // Busca las estadísticas individuales por su ID
        $stats = $entityManager->getRepository(IndividualStats::class)->find($id);

        // Verifica si las estadísticas individuales existen
        if (!$stats) {
            return new JsonResponse(['error' => 'IndividualStats not found'], Response::HTTP_NOT_FOUND);
        }

        // Actualiza las estadísticas individuales con los datos proporcionados
        if (isset($data['pace'])) {
            $stats->setPace($data['pace']);
        }
        if (isset($data['shooting'])) {
            $stats->setShooting($data['shooting']);
        }
        if (isset($data['physical'])) {
            $stats->setPhysical($data['physical']);
        }
        if (isset($data['defending'])) {
            $stats->setDefending($data['defending']);
        }
        if (isset($data['dribbling'])) {
            $stats->setDribbling($data['dribbling']);
        }
        if (isset($data['passing'])) {
            $stats->setPassing($data['passing']);
        }
        if (isset($data['position'])) {
            $stats->setPosition($data['position']);
        }
        if (isset($data['user_id'])) {
            $user = $entityManager->getRepository(User::class)->find($data['user_id']);
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }
            $stats->setUser($user);
        }

        // Actualiza las estadísticas individuales en la base de datos
        $entityManager->flush();

        // Devuelve una respuesta de éxito
        return new JsonResponse(['message' => 'IndividualStats updated successfully'], Response::HTTP_OK);
    }
}
