# Documentación de Pruebas (Tests)

Este proyecto utiliza dos tipos principales de pruebas para asegurar la calidad y estabilidad del código.

## 1. Pruebas Unitarias y de Componentes (Jest + React Testing Library)

Estas pruebas se utilizan para verificar la lógica individual de las funciones y el comportamiento de los componentes de React en aislamiento.

### Comandos
- **Ejecutar todos los tests:**
  ```bash
  npm test
  ```
- **Modo observador (watch mode):**
  ```bash
  npm run test:watch
  ```

### Ubicación
Los archivos de prueba se encuentran generalmente junto al archivo que prueban o en una carpeta `__tests__`, con la extensión `.test.js` o `.spec.js`.

---

## 2. Pruebas de Extremo a Extremo (Playwright)

Estas pruebas simulan interacciones de usuario reales en un navegador para verificar flujos completos de la aplicación.

### Comandos
- **Ejecutar tests en segundo plano (headless):**
  ```bash
  npm run test:e2e
  ```
- **Abrir la interfaz de usuario de Playwright (recomendado para desarrollo):**
  ```bash
  npm run test:e2e:ui
  ```
- **Ver el reporte de los tests:**
  ```bash
  npx playwright show-report
  ```

### Requisitos
Asegúrate de que el servidor de desarrollo esté corriendo (`npm run dev`) antes de ejecutar los tests de E2E si la configuración lo requiere, o que la URL base en `playwright.config.js` sea accesible.

### Ubicación
Los tests de extremo a extremo se encuentran en la carpeta `/e2e`.

---

## Mejores Prácticas
1. **Frecuencia:** Ejecuta las pruebas unitarias frecuentemente durante el desarrollo.
2. **Cobertura:** Intenta cubrir casos de éxito y casos de error (edge cases).
3. **Nombres:** Usa nombres descriptivos en los bloques `describe` e `it`/`test` para que sea fácil identificar qué falló.
