# Etapa 1: Construcción con Maven
# Usamos una imagen que ya tiene Java y Maven para compilar el proyecto.
FROM maven:3.8.5-openjdk-17 AS build

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo el pom.xml para descargar las dependencias y acelerar futuras builds
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el resto del código fuente y construimos el .jar
COPY src ./src
RUN mvn package -DskipTests

# Etapa 2: Ejecución
# Usamos una imagen ligera que solo tiene el entorno de ejecución de Java
FROM openjdk:17-jdk-slim

# Copiamos el .jar construido de la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto 8081
EXPOSE 8081

# El comando para ejecutar la aplicación cuando el contenedor inicie
ENTRYPOINT ["java","-jar","/app.jar"]