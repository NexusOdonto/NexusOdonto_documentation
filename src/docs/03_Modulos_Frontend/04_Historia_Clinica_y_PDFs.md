---
title: "Historia Clínica y Generación de PDFs"
order: 4
author: "NexusOdonto Clinical Engineering"
date: "2026-09-16"
---

# Historia Clínica Electrónica y Motor de PDFs

NexusOdonto proporciona un expediente clínico digital completo que cumple con las regulaciones de historia clínica electrónica y permite la exportación instantánea en formato PDF.

---

## 1. Visualizador de Detalle con Portal (`DrawerPortal`)

Para evitar problemas de recorte de texto (*text clipping*) y solapamiento de capas en pantallas con múltiples niveles de anidación, el cajón lateral de detalles del paciente se renderiza utilizando un **React Portal** directo sobre el elemento `document.body`:
* Renderizado fuera de la jerarquía DOM padre.
* Transición suave de entrada/salida (*slide-over*).
* Historial cronológico de evoluciones médicas con fecha, hora, diagnóstico CIE-10 y firma digital del odontólogo responsable.

---

## 2. Motor de Generación de Documentos PDF

El frontend incluye tres plantillas especializadas para la emisión de documentos oficiales:

1. **`HistoriaClinicaPDF`:** Resumen completo del expediente, antecedentes médicos (alergias, patologías, medicamentos), odontograma actual y registro de evoluciones.
2. **`FormulaMedicaPDF`:** Recetario médico odontológico con membrete institucional de la clínica, datos del paciente, dosificación de medicamentos, indicaciones y firma del odontólogo tratante.
3. **`RegistroIndividualPDF`:** Comprobante de atención individual por sesión para entrega física o digital al paciente o aseguradora.
