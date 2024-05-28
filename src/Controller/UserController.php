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
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\SerializerInterface;
use App\Repository\UserRepository;


#[Route('/user', name: 'app_user')]
class UserController extends AbstractController
{
    #[Route('/me', name: 'user_me', methods: ['GET'])]
    public function getMe(Request $request, JWTTokenManagerInterface $jwtManager, UserRepository $userRepository): JsonResponse
    {
        // Obtiene el token desde la cabecera de la solicitud
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return new JsonResponse(['error' => 'Token not found'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $token = $matches[1];

        // Decodifica el token JWT
        try {
            $decodedToken = $jwtManager->parse($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid token'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Verifica que el token tenga un campo de email
        if (!isset($decodedToken['email'])) {
            return new JsonResponse(['error' => 'Invalid token payload'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $email = $decodedToken['email'];

        // Busca el usuario en la base de datos utilizando el email
        $user = $userRepository->findOneBy(['email' => $email]);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Formatea los datos del usuario para la respuesta
        $formattedUser = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles()
        ];

        // Devuelve una respuesta JSON con los datos del usuario
        return new JsonResponse($formattedUser);
    }

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
    #[Route('/{id}', name: 'user_get', methods: ['GET'])]
    public function getUserById(int $id, EntityManagerInterface $entityManager): JsonResponse

    {
        // Obtiene el repositorio de la entidad User
        $userRepository = $entityManager->getRepository(User::class);

        // Busca el usuario por su ID
        $user = $userRepository->find($id);

        // Verifica si el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Formatea los datos del usuario para la respuesta
        $formattedUser = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles() // Puedes incluir otros campos si lo deseas
        ];

        // Devuelve una respuesta JSON con el usuario encontrado
        return new JsonResponse($formattedUser);
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
    #[Route('/api/getuserinfo', name: 'app_get_user_info', methods: ['POST'])]
    public function getUserInfo(SerializerInterface $serializerInterface, JWTTokenManagerInterface $jwtManagerInterface, TokenStorageInterface $tokenStorageInterface, UserRepository $userRepository): Response
    {
        $decodedToken = $jwtManagerInterface->decode($tokenStorageInterface->getToken());
        // Obtener el username del usuario desde el token decodificado
        $username = $decodedToken['username'];
        // Buscar el usuario en la base de datos usando el username obtenido
        $user = $userRepository->findOneBy(['username' => $username]);
        // Devolver los datos del usuario en la respuesta HTTP
        $response =  $serializerInterface->serialize([
            'username' => $user->getUsername(),
            'id' => $user->getId(),
        ], 'json');
 
        return new JsonResponse($response, 200, [
            'Content-Type' => 'application/json',
        ], true);
    }

}
