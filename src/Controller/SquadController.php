<?php

namespace App\Controller;

use App\Entity\Squad;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
#[Route('/squad', name: 'app_squad')]
class SquadController extends AbstractController
{
    #[Route('/all', name: 'squad_all', methods: ['GET'])]
    public function getAllSquads(EntityManagerInterface $entityManager): JsonResponse
    {
        // Obtiene el repositorio de la entidad Squad
        $squadRepository = $entityManager->getRepository(Squad::class);

        // Obtiene todas las escuadras
        $squads = $squadRepository->findAll();

        // Formatea los datos de las escuadras para la respuesta
        $formattedSquads = [];
        foreach ($squads as $squad) {
            $formattedSquads[] = [
                'id' => $squad->getId(),
                'name' => $squad->getName(),
                // Puedes incluir otros campos si lo deseas
            ];
        }

        // Devuelve una respuesta JSON con todas las escuadras
        return new JsonResponse($formattedSquads);
    }

    #[Route('/create', name: 'squad_create', methods: ['POST'])]
    public function createSquad(Request $request, EntityManagerInterface $entityManager): Response
    {
        // Obtiene los datos del cuerpo de la solicitud
        $data = json_decode($request->getContent(), true);

        // Verifica si se ha proporcionado el nombre de la escuadra
        if (!isset($data['name'])) {
            return new JsonResponse(['error' => 'Squad name is required'], Response::HTTP_BAD_REQUEST);
        }

        // Crea una nueva instancia de la entidad Squad
        $squad = new Squad();
        $squad->setName($data['name']);

        // Obtiene el usuario que está realizando la solicitud (puedes adaptar este código según la autenticación y el sistema de usuarios de tu aplicación)
        $user = $this->getUser(); // Este método puede variar dependiendo del sistema de autenticación que estés utilizando

        // Verifica si se pudo obtener el usuario
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_BAD_REQUEST);
        }

        // Añade el usuario al squad
        $squad->addUser($user);

        // Guarda la escuadra en la base de datos
        $entityManager->persist($squad);
        $entityManager->flush();

        // Devuelve una respuesta de éxito
        return new JsonResponse(['message' => 'Squad created successfully'], Response::HTTP_CREATED);
    }


    #[Route('/{id}', name: 'squad_get', methods: ['GET'])]
    public function getSquadById(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Obtiene el repositorio de la entidad Squad
        $squadRepository = $entityManager->getRepository(Squad::class);

        // Busca la escuadra por su ID
        $squad = $squadRepository->find($id);

        // Verifica si la escuadra existe
        if (!$squad) {
            return new JsonResponse(['error' => 'Squad not found'], Response::HTTP_NOT_FOUND);
        }

        // Formatea los datos de la escuadra para la respuesta
        $formattedSquad = [
            'id' => $squad->getId(),
            'name' => $squad->getName(),
            // Puedes incluir otros campos si lo deseas
        ];

        // Devuelve una respuesta JSON con la escuadra encontrada
        return new JsonResponse($formattedSquad);
    }
    
    #[Route('/{id}', name: 'squad_update', methods: ['PUT'])]
    public function updateSquad(int $id, Request $request, EntityManagerInterface $entityManager): Response
    {
        // Obtiene el repositorio de la entidad Squad
        $squadRepository = $entityManager->getRepository(Squad::class);

        // Busca la escuadra por su ID
        $squad = $squadRepository->find($id);

        // Verifica si la escuadra existe
        if (!$squad) {
            return new JsonResponse(['error' => 'Squad not found'], Response::HTTP_NOT_FOUND);
        }

        // Obtiene los datos del cuerpo de la solicitud
        $data = json_decode($request->getContent(), true);

        // Verifica si se ha proporcionado el nombre de la escuadra
        if (!isset($data['name'])) {
            return new JsonResponse(['error' => 'Squad name is required'], Response::HTTP_BAD_REQUEST);
        }

        // Actualiza el nombre de la escuadra
        $squad->setName($data['name']);

        // Guarda los cambios en la base de datos
        $entityManager->flush();

        // Devuelve una respuesta de éxito
        return new JsonResponse(['message' => 'Squad updated successfully'], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'squad_delete', methods: ['DELETE'])]
    public function deleteSquad(int $id, EntityManagerInterface $entityManager): Response
    {
        // Obtiene el repositorio de la entidad Squad
        $squadRepository = $entityManager->getRepository(Squad::class);

        // Busca la escuadra por su ID
        $squad = $squadRepository->find($id);

        // Verifica si la escuadra existe
        if (!$squad) {
            return new JsonResponse(['error' => 'Squad not found'], Response::HTTP_NOT_FOUND);
        }

        // Elimina la escuadra de la base de datos
        $entityManager->remove($squad);
        $entityManager->flush();

        // Devuelve una respuesta de éxito
        return new JsonResponse(['message' => 'Squad deleted successfully'], Response::HTTP_OK);
    }
    #[Route('/{id}/addUser/{userId}', name: 'squad_add_user', methods: ['POST'])]
    public function addUserToSquad(int $id, int $userId, EntityManagerInterface $entityManager): Response
    {
        // Obtiene el repositorio de la entidad Squad
        $squadRepository = $entityManager->getRepository(Squad::class);

        // Busca la escuadra por su ID
        $squad = $squadRepository->find($id);

        // Verifica si la escuadra existe
        if (!$squad) {
            return new JsonResponse(['error' => 'Squad not found'], Response::HTTP_NOT_FOUND);
        }

        // Busca el usuario por su ID
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($userId);

        // Verifica si el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Asocia el usuario con la escuadra
        $squad->addUser($user);

        // Guarda los cambios en la base de datos
        $entityManager->flush();

        // Devuelve una respuesta de éxito
        return new JsonResponse(['message' => 'User added to squad successfully'], Response::HTTP_OK);
    }

    #[Route('/{id}/removeUser/{userId}', name: 'squad_remove_user', methods: ['POST'])]
    public function removeUserFromSquad(int $id, int $userId, EntityManagerInterface $entityManager): Response
    {
        // Obtiene el repositorio de la entidad Squad
        $squadRepository = $entityManager->getRepository(Squad::class);

        // Busca la escuadra por su ID
        $squad = $squadRepository->find($id);

        // Verifica si la escuadra existe
        if (!$squad) {
            return new JsonResponse(['error' => 'Squad not found'], Response::HTTP_NOT_FOUND);
        }

        // Busca el usuario por su ID
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($userId);

        // Verifica si el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Desasocia el usuario de la escuadra
        $squad->removeUser($user);

        // Guarda los cambios en la base de datos
        $entityManager->flush();

        // Devuelve una respuesta de éxito
        return new JsonResponse(['message' => 'User removed from squad successfully'], Response::HTTP_OK);
    }
}
