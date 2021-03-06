# Gent

Este es un proyecto surge por la lamentable desaparici贸n de [Genoom](https://www.genoom.com/). Se trata de una visor de documentos [GEDCOM](https://es.wikipedia.org/wiki/GEDCOM). Surge como una alternativa libre y sencilla a las ya existentes.

Por 煤ltimo, me gustar铆a dedicar este proyecto a Vir铆n. Gracias por todo, abuela, espero que te guste馃槉

## Instalaci贸n

Para la instalaci贸n del proyecto, es necesario descargar una de las versiones existentes y [disponibles en el repositorio](https://github.com/BorjaZarco/gent-app/releases). Tras la descarga, se debe de descomprimir el paquete para poder acceder a los ficheros que contienen el c贸digo y una build de la aplicaci贸n para dispositivos Windows.

Como se ha mencionado anteriormente, la distribuci贸n contiene 煤nicamente una versi贸n ejecutable para sistemas Windows. Lamentablemente, ha sido imposible generar una versi贸n de la aplicaci贸n para Mac o Linux. No obstante, consulte la secci贸n de ejecuci贸n local para poder ejecutarlo en dichos sistemas

## Ejecuci贸n local

Si se desea ejecutar el proyect(o de forma local es necesario tener instalado [NodeJS](https://nodejs.org/), para descargar las dependencias del proyecto listadas en el `package.json`. Para instalar dichas dependencias, es necesario ejecutar en la terminal del sistema el siguiente comando:

```
$ npm i
```

### Ejecuci贸n web

Para ejecutar el proyecto en web, basta con ejecutar el siguiente comando:

```
$ npm start
```

Esto compilar谩 el proyecto angular y lo lanzar谩 en un [servidor local](http://localhost:4200)

### Ejecuci贸n local

Para ejecutar el proyecto en electron, basta con ejecutar el siguiente comando:

```
$ npm run electron
```

Esto compilar谩 el proyecto angular, generar谩 un archivo ejecutable y lo lanzar谩 localmente. Cuando termine el proceso, la aplicaci贸n aparecer谩 en pantalla autom谩ticamente

## Uso

En el proceso de dise帽o de la interfaz de la aplicaci贸n se ha tenido muy en cuenta la experiencia del usuario. Por ello se ha hecho especial hincapi茅 en la sencillez de la misma. Debido a esta sencillez, se considera que una peque帽a gu铆a visual bastar谩 para mostrar todas las funcionalidades de la aplicaci贸n.

![walthrough](./public/walkthrough.gif)

Para probar este proyecto se pueden descargar el archivo GEDCOM de prueba que se encuentra en [este repositorio](./public/demo.ged).

## Tecnolog铆as

Se ha implementado el proyecto en [Angular](https://angular.io/) dado su gran potencial para crear aplicaciones web. Adem谩s, se ha empleado [Electron](https://www.electronjs.org/) para evitar el uso de servidores o bases de datos externas. Esta decisi贸n viene motivada de la decisi贸n de dejar el c贸digo completo del proyecto de forma visbile y libre. De esta manera, se evitan posibles brechas de seguridad que permitan el acceso a datos de diferentes usuarios de la aplicaci贸n. Adem谩s, permite que el proyecto sea usado libremente y adaptado a cualquier tecnolg铆a de forma f谩cil. El listado completo de dependencias se muestra a continuaci贸n:

- [Angular](https://angular.io/)
- [Electron](https://www.electronjs.org/)
- [PrimeNG](https://www.primefaces.org/primeng/)
- [TailwindCSS](https://tailwindcss.com/)
- [SweetAlert](https://sweetalert2.github.io/)

```

```
