# Especificación del Proyecto: MandalasGenerator

## 1) Objetivo
Construir una web sencilla en **Next.js** que genere mandalas automáticamente en el navegador y permita **exportarlas en PDF imprimible** de forma rápida.

## 2) Problema a resolver
Queremos que una persona pueda tocar un botón y obtener una mandala nueva para colorear, evitando repeticiones perceptibles y reduciendo el aburrimiento.

## 3) Principios del producto
- Generación instantánea (clic -> mandala nueva).
- Salida orientada a impresión (PDF limpio, alto contraste).
- Alta diversidad visual entre generaciones.
- Sin fricción: UX mínima y directa.

## 4) Alcance
### MVP (v1)
- App web en Next.js.
- Render de mandalas en el navegador (SVG).
- Botón principal: `Generar nueva mandala`.
- Botón secundario: `Descargar PDF`.
- Formato de impresión inicial: A4 vertical, márgenes seguros.
- Estilo base: line art en negro sobre fondo blanco.

### Fuera de alcance en v1
- Editor avanzado de parámetros.
- Cuenta de usuario/historial en servidor.
- Animaciones complejas.
- IA por prompt de texto.

## 5) Requisito de aleatoriedad y no repetición
Es cierto que una `seed` permite reproducir una mandala, pero en este producto la prioridad es la **variedad**.

Decisión:
- En flujo normal, la seed se genera automáticamente (`crypto.getRandomValues`) y no se expone como control principal.
- Se guarda un historial local corto (por ejemplo, últimas 30 huellas visuales) para evitar mandalas demasiado parecidas en la sesión.
- Si una candidata es muy similar a una reciente, se reintenta generación.

Nota: reproducibilidad queda como capacidad técnica interna, no como feature principal de UX en v1.

## 6) Decisión técnica propuesta
Stack recomendado para v1:
- **Next.js + TypeScript**.
- Render vectorial en **SVG** dentro del navegador.
- Exportación a PDF con pipeline cliente:
- SVG -> Canvas (raster de alta resolución) -> PDF A4.

Motivo:
- SVG permite geometría precisa para mandalas.
- El navegador facilita experiencia de “botón y listo”.
- El PDF cumple el objetivo de impresión inmediata.

## 7) Diseño del generador
### Modelo geométrico
Cada mandala se construye con:
- Centro.
- `N` sectores radiales.
- `L` anillos concéntricos.
- Motivos por anillo replicados por rotación.

### Biblioteca inicial de motivos
- Pétalos.
- Arcos decorativos.
- Polígonos/estrellas simples.
- Puntos y círculos ornamentales.

### Motor de diversidad
- RNG para parámetros geométricos.
- Restricciones para legibilidad de coloreo.
- Perfilado de complejidad (simple/medio/denso).
- Reglas anti-monotonía:
- balance de espacio negativo/positivo,
- variación de ritmo radial,
- límite de repetición de motivo dominante.

## 8) Flujo de usuario v1
1. Abre la web.
2. Ve una mandala inicial.
3. Presiona `Generar nueva mandala` para obtener otra distinta.
4. Presiona `Descargar PDF` para imprimir.

## 9) Requisitos funcionales
- Generar una nueva mandala en cliente sin recargar la página.
- Garantizar salida en PDF A4 imprimible.
- Mantener grosor de trazo apto para impresión doméstica.
- Evitar repeticiones cercanas en la misma sesión.

## 10) Requisitos no funcionales
- Tiempo de generación en UI: objetivo < 300 ms en equipos medios.
- Exportación PDF: objetivo < 1.5 s.
- Sin dependencia de backend para generar mandalas.
- Compatibilidad objetivo: navegadores modernos (Chrome/Edge/Firefox/Safari recientes).

## 11) Arquitectura propuesta
- `app/page.tsx`: pantalla principal y acciones.
- `components/MandalaCanvas.tsx`: render SVG.
- `lib/mandala/generator.ts`: composición geométrica.
- `lib/mandala/motifs.ts`: primitivas y motivos.
- `lib/mandala/random.ts`: RNG + utilidades.
- `lib/mandala/diversity.ts`: reglas anti-repetición.
- `lib/export/pdf.ts`: exportación a PDF.
- `types/mandala.ts`: tipos del dominio.

## 12) Plan por fases
### Fase 1 (MVP web)
- Setup Next.js + TypeScript.
- Generador radial base en SVG.
- 4-6 motivos iniciales.
- Botón generar.
- Export PDF A4.
- Historial local anti-repetición.

### Fase 2
- Perfiles de dificultad para coloreo (niños/adulto).
- Ajustes rápidos (simple, detallada, densa).
- Export en varios formatos de hoja (A4/Letter).

### Fase 3
- Colecciones temáticas.
- Generación por lote para cuadernillos.
- Persistencia opcional local de favoritas.

## 13) Riesgos y mitigación
- Riesgo: mandalas distintas pero “parecidas”.
- Mitigación: huella de features geométricas + umbral de similitud.
- Riesgo: PDF con calidad insuficiente de trazo.
- Mitigación: render interno a alta resolución y test de impresión.
- Riesgo: complejidad visual excesiva para colorear.
- Mitigación: límites por densidad y grosor mínimo.

## 14) Criterios de éxito
- Un usuario puede generar múltiples mandalas seguidas sin sensación de repetición inmediata.
- Cada mandala se descarga en PDF A4 lista para imprimir.
- Flujo principal se completa en 2 clics (`generar` / `descargar`).
- UX simple, sin configuración obligatoria.

## 15) Fuentes consultadas (base técnica)
- p5.js `rotate()`: https://p5js.org/reference/p5/rotate/
- Paper.js transformaciones: https://paperjs.org/reference/path/
- SVG write-up general: https://svgwrite.readthedocs.io/en/stable/svgwrite.html
- Processing `noise()` (referencia procedural): https://processing.org/reference/noise_.html
