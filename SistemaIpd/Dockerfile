# Usamos una imagen base oficial de OpenJDK con Java 17.
# 'slim' es una versión ligera, ideal para contenedores.
FROM openjdk:17-slim

# Argumento para el nombre del archivo JAR. Maven lo crea en la carpeta 'target'.
ARG JAR_FILE=target/*.jar

# Copiamos el archivo JAR desde la carpeta 'target' al interior del contenedor
# y lo renombramos a 'app.jar' para tener un nombre fijo.
COPY ${JAR_FILE} app.jar

# Exponemos el puerto en el que se ejecuta nuestra aplicación Spring Boot (8081).
EXPOSE 8081

# El comando que se ejecutará cuando el contenedor se inicie.
# Simplemente ejecuta la aplicación.
ENTRYPOINT ["java", "-jar", "/app.jar"]