<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/user', name: 'app_user')]
class UserController extends AbstractController
{
    #[Route('/all', name: 'user_all', methods: ['GET'])]
    public function getAllUsers(EntityManagerInterface $entityManager): JsonResponse
    {
        // Obtiene el repositorio de la entidad User
        $userRepository = $entityManager->getRepository(User::class);

        // Obtiene todos los usuarios
        $users = $userRepository->findAll();

        // Formatea los datos de los usuarios para la respuesta
        $formattedUsers = [];
        foreach ($users as $user) {
            $formattedUsers[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'password' => $user->getPassword()
            ];
        }

        // Devuelve una respuesta JSON con todos los usuarios
        return new JsonResponse($formattedUsers);
    }
    
    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        // Obtiene los datos del cuerpo de la solicitud
        $data = json_decode($request->getContent(), true);

        // Verifica si se han proporcionado el correo electrónico y la contraseña
        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Email and password are required'], Response::HTTP_BAD_REQUEST);
        }

        // Crea una nueva instancia de la entidad User
        $user = new User();
        $user->setEmail($data['email']);

        // Codifica la contraseña
        $encodedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($encodedPassword);

        // Guarda el usuario en la base de datos
        $entityManager->persist($user);
        $entityManager->flush();

        // Devuelve una respuesta de éxito
        return new JsonResponse(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }
}
