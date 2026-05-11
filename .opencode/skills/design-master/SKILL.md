---
name: design-master
description: Activa este skill cuando el usuario pida mejorar la UI, crear componentes visuales, aplicar sistemas de diseño profesionales o refinar la estética del frontend.
---

# Design Master Workflow (UI/UX + Frontend + Visual)

Este skill integra tres motores de diseño para transformar código genérico en interfaces de nivel producción.

## 1. Fase de Inteligencia UI/UX (Pro Max)

- **Análisis**: Antes de codificar, define el "Design System". Usa una paleta de colores coherente (ej. Esmeralda/Pizarra para SaaS, Indigo para Tech).
- **Jerarquía**: Aplica reglas de espaciado (8px grid) y emparejamiento de fuentes profesional (Inter + Geist).
- **UX**: Asegura estados de carga, feedback de éxito/error y accesibilidad (A11y).

## 2. Fase de Ingeniería Visual

- **Layouts**: Implementa estructuras modernas como Bento Grids o Glassmorphism si el contexto lo permite.
- **Componentes**: Utiliza librerías como Radix UI o Headless UI para garantizar funcionalidad perfecta.
- **Animaciones**: Añade micro-interacciones sutiles con Framer Motion o transiciones CSS nativas.

## 3. Fase de Refinado Frontend

- **Clean Code**: Escribe clases de Tailwind optimizadas (usa @apply si es necesario para legibilidad).
- **Responsive**: Diseño Mobile-first obligatorio. Verifica breakpoints en cada componente.
- **Anti-AI Slop**: Evita gradientes genéricos y sombras excesivas. Busca un look limpio y minimalista.

## Instrucciones de Ejecución

- Cuando se te pida "mejorar el diseño", primero presenta un **Plan de Diseño** detallando los cambios en colores, fuentes y estructura.
- Usa el modo `/plan` (tecla Tab) para validar la arquitectura visual antes de escribir el código final.
