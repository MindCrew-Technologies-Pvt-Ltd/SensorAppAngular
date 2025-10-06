# Overview

This is a modern Angular single-page application (SPA) built with Angular 20.3.x using the latest standalone component architecture. The application demonstrates best practices for Angular development with a clean, scalable folder structure organized into Core, Shared, and Features modules. It currently includes basic Home and About pages with navigation, serving as a foundation for building more complex features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework Choice: Angular 20.3.x with Standalone Components**
- **Problem**: Need for a modern, maintainable single-page application framework
- **Solution**: Angular 20 with standalone components eliminates the need for NgModules, simplifying the application structure
- **Pros**: Better tree-shaking, simpler dependencies, improved performance, easier lazy loading
- **Cons**: Requires Angular 14+ knowledge, different mental model from traditional NgModule-based apps

**Folder Structure: Feature-Based Organization**
- **Problem**: Managing code organization as the application grows
- **Solution**: Three-tier architecture:
  - `core/`: Application-wide services (currently contains `Data` service placeholder)
  - `shared/`: Reusable components like Header and Footer
  - `features/`: Feature-specific components (Home, About) that are lazy-loaded
- **Pros**: Clear separation of concerns, scalable, promotes code reuse
- **Cons**: May seem over-engineered for small applications

**Routing Strategy: Lazy Loading**
- **Problem**: Initial bundle size and loading performance
- **Solution**: Route-level code splitting using dynamic imports (`loadComponent`)
- **Alternatives**: Eager loading all components upfront
- **Pros**: Faster initial load, better performance, on-demand feature loading
- **Cons**: Slight delay when navigating to new routes for the first time

**State Management: RxJS-Based**
- **Problem**: Managing application state and reactive data flows
- **Solution**: RxJS (v7.8.0) for reactive programming patterns
- **Pros**: Built into Angular, powerful operators, excellent async handling
- **Cons**: Learning curve for developers unfamiliar with reactive programming

## Build & Development Configuration

**Build System: Angular CLI with Vite**
- **Problem**: Need for fast development builds and optimized production bundles
- **Solution**: Angular CLI 20.3.4 with `@angular/build` (Vite-based)
- **Pros**: Much faster development builds than webpack, better HMR, modern tooling
- **Cons**: Newer system with potential compatibility issues with older plugins

**TypeScript Configuration: Strict Mode**
- **Problem**: Catching type-related errors early in development
- **Solution**: TypeScript 5.9.2 with strict mode enabled (`strict: true`, `noImplicitReturns`, `noFallthroughCasesInSwitch`)
- **Pros**: Better code quality, fewer runtime errors, improved IDE support
- **Cons**: More verbose code, steeper learning curve

**Testing Framework: Jasmine + Karma**
- **Problem**: Ensuring code quality through automated testing
- **Solution**: Jasmine 5.9.0 for test specs, Karma 6.4.0 as test runner
- **Pros**: Well-established Angular testing tools, good community support
- **Cons**: Karma can be slow; alternatives like Jest are gaining popularity

## Styling Approach

**CSS Strategy: Component-Scoped Styles**
- **Problem**: Managing styles without conflicts in a component-based architecture
- **Solution**: Component-scoped CSS files with global styles in `src/styles.css`
- **Pros**: Prevents style leakage, better maintainability, clear ownership
- **Cons**: No CSS preprocessing (SASS/LESS) currently configured

**Design System: Custom CSS**
- **Problem**: Creating a consistent UI across the application
- **Solution**: Custom CSS with CSS variables for theming (color: `#1976d2` for primary)
- **Alternatives**: Material Design, Bootstrap, Tailwind CSS
- **Pros**: Lightweight, full control, no external dependencies
- **Cons**: More manual work, no pre-built components

## Performance Optimizations

**Change Detection: Zone.js with Event Coalescing**
- **Problem**: Efficient change detection in Angular applications
- **Solution**: Zone.js 0.15.0 with `eventCoalescing: true` enabled
- **Pros**: Reduced number of change detection cycles, better performance
- **Cons**: Zone.js adds overhead compared to zoneless Angular (experimental)

**Production Build Optimizations**
- **Problem**: Minimizing bundle size for production
- **Solution**: Budget constraints configured (500kB initial warning, 1MB error)
- **Pros**: Prevents bundle bloat, ensures performance targets are met
- **Cons**: May require code splitting if budgets are exceeded

# External Dependencies

## Core Framework Dependencies

- **@angular/core** (v20.3.0): Core Angular framework
- **@angular/common** (v20.3.0): Common Angular directives and pipes
- **@angular/compiler** (v20.3.0): Angular template compiler
- **@angular/platform-browser** (v20.3.0): Browser platform support
- **@angular/router** (v20.3.0): Client-side routing
- **@angular/forms** (v20.3.0): Reactive and template-driven forms (installed but not yet used)

## Development Dependencies

- **@angular/cli** (v20.3.4): Angular command-line interface
- **@angular/build** (v20.3.4): Vite-based build system
- **TypeScript** (v5.9.2): Type checking and compilation

## Testing Dependencies

- **Jasmine** (v5.9.0): Testing framework
- **Karma** (v6.4.0): Test runner
- **karma-chrome-launcher** (v3.2.0): Chrome browser launcher for tests
- **karma-coverage** (v2.2.0): Code coverage reporting
- **karma-jasmine** (v5.1.0): Jasmine adapter for Karma
- **karma-jasmine-html-reporter** (v2.1.0): HTML test result reporter

## Runtime Dependencies

- **RxJS** (v7.8.0): Reactive extensions for JavaScript
- **Zone.js** (v0.15.0): Execution context for async operations
- **tslib** (v2.3.0): TypeScript runtime library

## Future Integration Considerations

The application structure supports easy integration of:
- Backend APIs (no current HTTP client usage detected)
- State management libraries (NgRx, Akita, etc.)
- UI component libraries (Angular Material, PrimeNG, etc.)
- Form validation and handling (reactive forms already available)
- Authentication/authorization services (structure in `core/services` ready)