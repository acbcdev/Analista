# Gemini Project Context: Analista

     ## 1. Resumen del Proyecto

     - **Tipo:** Extensión de Navegador.
     - **Objetivo:** esta es una extension de navegador que te permite gestionar modelos webcam y gestionar datos de tus modelos.
     - **Funcionalidades:** Gestionar modelos webcam, gestionar datos de tus modelos, gestionar tus modelos.


    ## 2. Stack Tecnológico Principal

    - **Framework de Extensión:** WXT
    - **UI Framework:** React 19 con TypeScript
    - **Biblioteca de Componentes:** shadcn/ui (usando Radix UI como primitivos)
    - **Estilos:** Tailwind CSS
    - **Gestión de Estado:** Zustand
    - **Formularios:** React Hook Form con Zod para validación
    - **Tablas/Gráficos:** TanStack Table y Recharts
    - **Iconos:** Lucide React
    - **Package Manager:** Bun
    ## 3. Comandos Esenciales
    -- **Instalar dependencias:** `bun install`
    - **Iniciar desarrollo:** `bun dev`
    - **Construir para producción:** `bun run build`
    - **Empaquetar para tiendas:** `bun run zip`

    ## 4. Estructura y Convenciones

    - **Puntos de Entrada:** El código de la extensión (background, content scripts, popup,dashboard) se encuentra en `entrypoints/`.
    - **Dashboard Principal:** La UI del dashboard está en `entrypoints/dashboard/`.
    - **Componentes UI (shadcn/ui):** Los componentes reutilizables de shadcn/ui están en `components/ui/`.
    - **Componentes Personalizados:** Los componentes más complejos o específicos de la aplicación se encuentran en `components/`.
    - **Estado Global:** El estado se gestiona con Zustand en la carpeta `store/`.

    ## 5. Flujo de Trabajo y Estilo

    - **Nuevos Componentes UI:** Para añadir nuevos componentes de UI genéricos, se utiliza el CLI de `shadcn/ui`.
    - **Estilos:** Los estilos se aplican principalmente con clases de Tailwind CSS.
