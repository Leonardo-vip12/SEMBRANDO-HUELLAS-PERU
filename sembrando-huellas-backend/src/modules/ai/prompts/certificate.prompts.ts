export const CERTIFICATE_TEMPLATES: Record<string, string> = {
  voluntariado: `Certificado de Participación en Voluntariado Ambiental

"SEMBRANDO HUELLAS PERÚ"

Otorgado a: {{recipientName}}

Por su valiosa participación como voluntario en {{programName}},
demostrando compromiso con la conservación del medio ambiente
y el desarrollo sostenible del Perú.

{{hours}} horas de servicio
{{eventDate}}

"El futuro de nuestro planeta está en nuestras manos"

───
Código de verificación: {{verificationCode}}`,

  capacitacion: `Certificado de Capacitación Ambiental

"SEMBRANDO HUELLAS PERÚ"

Otorgado a: {{recipientName}}

Por haber completado satisfactoriamente el programa de capacitación
{{programName}}, con una duración de {{hours}} horas.

{{eventDate}}

───
Código de verificación: {{verificationCode}}`,

  evento: `Certificado de Asistencia

"SEMBRANDO HUELLAS PERÚ"

Otorgado a: {{recipientName}}

Por su asistencia y participación en {{programName}},
realizado el {{eventDate}}.

───
Código de verificación: {{verificationCode}}`,
};
