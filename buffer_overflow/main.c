#include <stdio.h>
#include <string.h>

void tiktok() {
    printf("Félicitations ! Abonne toi à mon tiktok tyki6\n");
}

void vulnerable_function() {
    char buffer[16];

    printf("Entre ton payload : ");
    gets(buffer);
}

int main() {
    vulnerable_function();
    printf("Au revoir !\n");
    return 0;
}
