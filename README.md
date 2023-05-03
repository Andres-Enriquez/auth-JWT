# Buenas practicas de seguridad con JWT(Token de actualización y token de acceso)
Esta plataforma esta desarrollada con Node js en typescript y mongoDB.

## Escenarios de uso sobre los tokens
* Cuando un usuario inicia sesión se genera un token de acceso y un token de actualización. El token de actualización se guarda en la base de datos con id de sessión
y el token de acceso se envia en la cookie firmada.

* Cuando un usuario realiza una solicitud debe enviar el token de acceso en la cookie firmada. Si la cookie no es valida el servidor responde que la cookie no es valida
de lo contrario se verifica si el token de acceso es valido.

* Cuando un token de acceso expira, se debe realizar la solicitud de generar nuevo token de acceso para ello se debe verificar que el token de actualización sea valido
para generar un nuevo token de acceso y actualización los tokens anteriores se almacenan en la lista negra para asegurar de que los tokens no se pueden usar.

* Cuando un usuario cierra sesion se elimina la cookie y se guarda el token de actualización en la lista negra. para asi verificar que el token ya no se puede usar 
porque este token sigue vigente es decir no ha expirado por eso se guarda en la lista negra para estar verificando.

* Los token de acceso tienen una duración de vida muy corta de 5 o 10 minutos dependiendo del proyecto que se este desarrollando y los token de actualización 
tiene una duración de vida mas larga de 15 o 30 dias. Este token de actualización se utiliza para generar un nuevo token de acceso. Pero en este caso genero los dos
y el token de actualizacion ya no es valida se guarda en la lista negra.


