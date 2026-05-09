# MandalasGenerator

Generador web de mandalas aleatorias hecho con Next.js para crear, previsualizar y descargar mandalas en PDF A4 listo para imprimir.

## Por qué existe
Este proyecto nació para resolver una necesidad real y simple: generar mandalas imprimibles rápido para mi abuela, desde cualquier dispositivo y sin pasos técnicos.

## Qué hace
- Genera mandalas nuevas en cada intento (enfoque diversidad-first).
- Muestra vista previa inmediata en el navegador.
- Exporta en PDF A4 imprimible.
- Funciona como web responsive (desktop y mobile).

## Privacidad
No se recolectan, almacenan ni comparten datos personales.

## Stack técnico
- Next.js + React
- SVG + `svg2pdf.js` / `jsPDF`
- `canvg` como fallback de render
- Tests con Vitest y Playwright

## Uso local
```bash
npm install
npm run dev
```
Abrir `http://localhost:3000`.

## Scripts
- `npm run dev`: entorno local
- `npm run build`: build de producción
- `npm run start`: correr build
- `npm run test`: tests unitarios/integración (Vitest)
- `npm run test:e2e`: tests end-to-end (Playwright)
- `npm run lint`: lint con ESLint

## Especificación
- `docs/spec-mandalas.md`
