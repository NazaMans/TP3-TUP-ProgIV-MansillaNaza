--Tabla medico
CREATE TABLE `medico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `especialidad` varchar(45) NOT NULL,
  `matricula_profesional` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula_profesional_UNIQUE` (`matricula_profesional`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


--Tabla paciente

CREATE TABLE `paciente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `dni` varchar(45) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `obra_social` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni_UNIQUE` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

--Tabla turno

CREATE TABLE `turno` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `medico_id` int NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(45) NOT NULL,
  `observaciones` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pk_turno_paciente_idx` (`paciente_id`),
  KEY `pk_turno_medico_idx` (`medico_id`),
  CONSTRAINT `fk_turno_medico` FOREIGN KEY (`medico_id`) REFERENCES `medico` (`id`),
  CONSTRAINT `fk_turno_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `turno` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


--Tabla usuario 

CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password_hash` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci