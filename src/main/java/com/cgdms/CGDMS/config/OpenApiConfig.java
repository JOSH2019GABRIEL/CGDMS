package com.cgdms.CGDMS.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact (
                        name = "Admin Admin",
                        email = "admin@gmail.com",
                        url = "https://url.com"
                ),
                description = "OpenApi decumentation for Spring Security",
                title = "Open Api Specification - CGDMS",
                version = "1.0.0",
                license = @License(
                        name = "Licence name",
                        url = "Licence url.com"
                ),
                termsOfService = "Terms of service"

        ),
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:9191/api/v1"
                ),
                @Server(
                        description = "PROD ENV",
                        url = "prod url.com"
                )
        },
        security = {
                @SecurityRequirement(
                        name = "BearerAuth"
                )
        }
)
@SecurityScheme(
        name = "BearerAuth",
        description = "JWT Auth description",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
