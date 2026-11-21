<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugins-hero-en-dark.webp">
  <img src="docs/assets/dsh-plugins-hero-en-light.webp" width="100%" alt="dsh-plugins: el índice de la familia de plugins DSH de PerryLink — 27 filas de plugins y 2 suites repartidas en 6 familias de negocio en README.md, junto con packages.json (27 paquetes + 2 suites), family.json (137 filas, 126 activas) y taxonomy.v1.json (91 elementos) versionados al lado; a la derecha, el número de filas por familia y ejemplos de versión">
</picture>

# Plugins de dominio DSH de PerryLink

**El índice de la familia de plugins DSH de PerryLink: 27 paquetes de dominio + 2 suites de instalación en un solo comando, repartidos en 6 familias de negocio, todos con nombres npm sin scope (`dsh-*`).**

*Las tablas del índice de README.md son el punto de entrada, `packages.json` y `family.json` son las fuentes de datos y `market/index.json` es lo que lee la pestaña Discover de DSH Desktop; este repositorio solo lista demos sintéticas públicas: sin datos de clientes y sin ninguna declaración de disponibilidad en producción.*

[English](README.en.md) · [简体中文](README.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-plugins)

</div>

> **Status: alpha / public-synthetic / partial / not counted / not GA.** La agrupación completa por familias está en [FAMILY.md](https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md); la taxonomía de cuatro ejes está en [TAXONOMY.md](TAXONOMY.md); una vista filtrable de 137 filas (126 activas) está en [taxonomy.html](docs/taxonomy.html). Este índice solo lista demos sintéticas públicas; no hay evidencia de clientes, datos de clientes ni declaración de disponibilidad en producción. SKU-11/14 están permanentemente DROP.

27 plugins de dominio DSH, todos con **nombres npm sin scope** (`dsh-*`), organizados en 6 familias de negocio.

## Instalación

![dsh-plugins ejecución real en una terminal: node scripts/f1-retrieval.mjs busca en market/index.json con 16 preguntas de tareas cotidianas y cada pregunta resuelve un plugin dsh-* en su top 3 — tasa de acierto 16/16](docs/assets/dsh-plugins-demo.gif)

*Animado: el stdout real del experimento de recuperación de solo lectura del propio repositorio, `node scripts/f1-retrieval.mjs` (repetición del 2026-11-21) — 16 preguntas de tareas sobre los 136 plugins de `market/index.json`, tasa de acierto 16/16 (100,0 %). Sin red y sin llamadas al modelo.*

```sh
dsh plugin --profile <profile> add dsh-ghg
```

Requiere DSH `>=0.2.1-rc.3 <0.3.0` y Node `>=24.9 <25`.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugins-flow-v5-dark.svg">
  <img src="docs/assets/dsh-plugins-flow-v5-light.svg" width="100%" alt="estructura de dsh-plugins: las tablas del índice junto con packages.json, family.json y taxonomy.v1.json construyen las páginas de docs/ y market/index.json, y tres puertas de solo lectura — check-taxonomy.mjs, check-docs.mjs y f1-retrieval.mjs — verifican el resultado; el límite es public/synthetic, partial, sin recuento y sin GA">
</picture>

*Estructura: tablas del índice → JSON versionados → docs/ y market/index.json → puertas de solo lectura. Las etiquetas del diagrama son los nombres reales de archivos y scripts, así que la misma imagen sirve para los cinco idiomas.*

## Índice

### Finanzas (Finance Ops)

| Paquete | Propósito | Versión | Instalación |
|---|---|---:|---|
| [`dsh-einvoice`](https://github.com/PerryLink/dsh-einvoice) | Ingesta, análisis, deduplicación y archivo local de facturas electrónicas chinas (OFD/XML) a nivel de archivo. | `0.2.0` | `dsh plugin --profile <profile> add dsh-einvoice` |
| [`dsh-bankrec`](https://github.com/PerryLink/dsh-bankrec) | Ingesta de extractos bancarios / GL / CAMT.053 / MT940, conciliación y un papel de trabajo de tres estados. | `0.1.0` | `dsh plugin --profile <profile> add dsh-bankrec` |
| [`dsh-ap-three-way`](https://github.com/PerryLink/dsh-ap-three-way) | Conciliación a tres bandas factura / OC / GRN, tolerancias y un papel de trabajo de excepciones. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ap-three-way` |
| [`dsh-travel-recon`](https://github.com/PerryLink/dsh-travel-recon) | Conciliación de reservas de viaje / facturas / extractos de tarjeta, deduplicación y una comprobación de políticas de solo lectura. | `0.1.0` | `dsh plugin --profile <profile> add dsh-travel-recon` |

### Jurídico (Legal Ops)

| Paquete | Propósito | Versión | Instalación |
|---|---|---:|---|
| [`dsh-legal-intake`](https://github.com/PerryLink/dsh-legal-intake) | Ingesta de solicitudes jurídicas en EML, deduplicación de hilos y exportación del libro registro. | `0.1.0` | `dsh plugin --profile <profile> add dsh-legal-intake` |
| [`dsh-legal-clause`](https://github.com/PerryLink/dsh-legal-clause) | Árbol de cláusulas del contrato, mapeo al playbook y un informe de cuestiones abiertas. | `0.1.0` | `dsh plugin --profile <profile> add dsh-legal-clause` |

### ESG y calidad (ESG & Quality)

| Paquete | Propósito | Versión | Instalación |
|---|---|---:|---|
| [`dsh-ghg`](https://github.com/PerryLink/dsh-ghg) | Ingesta de la actividad eléctrica, cálculo de GEI, recálculo fila por fila, un papel de trabajo y un paquete ESRS parcial. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ghg` |
| [`dsh-qms-capa`](https://github.com/PerryLink/dsh-qms-capa) | Ingesta de NCR del QMS, alias de lotes, evaluación de impacto, CAPA y 8D. | `0.1.0` | `dsh plugin --profile <profile> add dsh-qms-capa` |

### Comercio y logística (Trade & Logistics)

| Paquete | Propósito | Versión | Instalación |
|---|---|---:|---|
| [`dsh-hs-candidate`](https://github.com/PerryLink/dsh-hs-candidate) | Candidatos Top-3 de HS, integridad de los 12 elementos, puertas de RVC y de versión arancelaria. | `0.1.0` | `dsh plugin --profile <profile> add dsh-hs-candidate` |
| [`dsh-freight-audit`](https://github.com/PerryLink/dsh-freight-audit) | Versiones de tarifas de flete, auditoría de facturas, resumen de recuperación y exportación de desviaciones. | `0.1.0` | `dsh plugin --profile <profile> add dsh-freight-audit` |

### Documentos y modelos (Docs & Models)

| Paquete | Propósito | Versión | Instalación |
|---|---|---:|---|
| [`dsh-docx-redline`](https://github.com/PerryLink/dsh-docx-redline) | Comprobación de estructura DOCX, roundtrip byte a byte y reemplazo de texto en un solo run. | `0.1.0` | `dsh plugin --profile <profile> add dsh-docx-redline` |
| [`dsh-ifc-qto`](https://github.com/PerryLink/dsh-ifc-qto) | Extracción de componentes IFC / lista de cantidades con exportación a CSV. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ifc-qto` |

### Utilidades de verificación (Verify Utilities)

| Paquete | Propósito | Versión | Instalación |
|---|---|---:|---|
| [`dsh-policy-ledger`](https://github.com/PerryLink/dsh-policy-ledger) | Diagnóstico de instalación de solo lectura: instantánea de capacidades, aserciones de tarball y clasificación del log de instalación. | `0.2.0` | `dsh plugin --profile <profile> add dsh-policy-ledger` |
| [`dsh-pim-lint`](https://github.com/PerryLink/dsh-pim-lint) | Lint del catálogo PIM: campos obligatorios, SKU duplicados, dígitos de control GTIN y precios. | `0.1.0` | `dsh plugin --profile <profile> add dsh-pim-lint` |
| [`dsh-eval-pack`](https://github.com/PerryLink/dsh-eval-pack) | Lint de eval-packs públicos/sintéticos y puntuación JSON determinista. | `0.1.0` | `dsh plugin --profile <profile> add dsh-eval-pack` |
| [`dsh-provider-params`](https://github.com/PerryLink/dsh-provider-params) | Conversión de parámetros de proveedores y reparación JSON determinista. | `0.1.0` | `dsh plugin --profile <profile> add dsh-provider-params` |
| [`dsh-store-replenish`](https://github.com/PerryLink/dsh-store-replenish) | Recomendación de reposición de tienda: cantidad sugerida a partir de ventas, stock y mercancía en tránsito, señalando riesgo de rotura de stock y productos de baja rotación. | `0.1.0` | `dsh plugin --profile <profile> add dsh-store-replenish` |
| [`dsh-attendance-check`](https://github.com/PerryLink/dsh-attendance-check) | Comprobación de asistencia y horas extra: importa registros de fichaje, los compara con las horas estándar y los límites de horas extra, y señala excesos, fichajes faltantes y descanso insuficiente. | `0.1.0` | `dsh plugin --profile <profile> add dsh-attendance-check` |
| [`dsh-settlement-docs`](https://github.com/PerryLink/dsh-settlement-docs) | Integridad documental de la liquidación de obra: genera la lista de documentos según el tipo de proyecto, comprueba faltantes, número de copias, firmas y sellos, e informa la tasa de integridad. | `0.1.0` | `dsh plugin --profile <profile> add dsh-settlement-docs` |
| [`dsh-ar-collection`](https://github.com/PerryLink/dsh-ar-collection) | Cobro de cuentas por cobrar: genera planes de cobro y borradores de cartas de requerimiento en chino por tramo de antigüedad, y exporta la lista de cobro. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ar-collection` |
| [`dsh-import-customs-check`](https://github.com/PerryLink/dsh-import-customs-check) | Comprobación de documentos de importación: compara los nueve campos de la factura, la lista de empaque, el conocimiento de embarque y la declaración aduanera, y verifica la integridad de los 12 elementos de declaración. | `0.1.0` | `dsh plugin --profile <profile> add dsh-import-customs-check` |
| [`dsh-ar-aging`](https://github.com/PerryLink/dsh-ar-aging) | Antigüedad de cuentas por cobrar: importa el detalle de cuentas por cobrar, agrupa por antigüedad, resume importes vencidos y principales clientes, y exporta la tabla de antigüedad. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ar-aging` |
| [`dsh-progress-payment`](https://github.com/PerryLink/dsh-progress-payment) | Revisión de pagos por avance: contrasta la certificación de avance en curso con la cantidad y el precio unitario contratados, señalando exceso de cantidad, discordancia de precio unitario y partidas duplicadas. | `0.1.0` | `dsh plugin --profile <profile> add dsh-progress-payment` |
| [`dsh-labor-contract`](https://github.com/PerryLink/dsh-labor-contract) | Comprobación de contratos laborales: verifica cláusulas obligatorias, límites de periodo de prueba y ratios salariales, y señala contratos problemáticos en lote. | `0.1.0` | `dsh plugin --profile <profile> add dsh-labor-contract` |
| [`dsh-rfq-compare`](https://github.com/PerryLink/dsh-rfq-compare) | Comparación de RFQ: importa varias cotizaciones, compara por partida y señala cotizaciones por debajo del coste, por encima del presupuesto y caducadas. | `0.1.0` | `dsh plugin --profile <profile> add dsh-rfq-compare` |
| [`dsh-contract-renewal`](https://github.com/PerryLink/dsh-contract-renewal) | Renovación de contratos: registra inicio/fin y ventanas de renovación, lista los contratos próximos a vencer o ya vencidos, y exporta CSV. | `0.1.0` | `dsh plugin --profile <profile> add dsh-contract-renewal` |
| [`dsh-pdf-table`](https://github.com/PerryLink/dsh-pdf-table) | Extrae tablas de la capa de texto de PDF a CSV (los documentos escaneados necesitan OCR antes). | `0.1.0` | `dsh plugin --profile <profile> add dsh-pdf-table` |

Las dos suites también tienen espejos en Gitee / GitCode: [dsh-finops-suite](https://gitee.com/perrylink/dsh-finops-suite) / [dsh-contract-suite](https://gitee.com/perrylink/dsh-contract-suite).

## Artículo de escenario

- [De las facturas al viaje: cómo funciona una cadena de operaciones financieras revisable](https://perrylink.github.io/dsh-plugins/articles/finops-suite.html)

## Suites en un solo comando

| Suite | Miembros | Versión | Instalación |
|---|---|---:|---|
| [`dsh-finops-suite`](https://github.com/PerryLink/dsh-finops-suite) | `dsh-einvoice` + `dsh-bankrec` + `dsh-ap-three-way` + `dsh-travel-recon` | `0.1.0-alpha.10` | `dsh plugin --profile <profile> add dsh-finops-suite` |
| [`dsh-contract-suite`](https://github.com/PerryLink/dsh-contract-suite) | `dsh-legal-intake` + `dsh-legal-clause` | `0.1.0-alpha.9` | `dsh plugin --profile <profile> add dsh-contract-suite` |

## Plataformas

| Plataforma | Dirección | Notas |
|---|---|---|
| GitHub | https://github.com/PerryLink/dsh-plugins | Este índice + los repositorios de los paquetes |
| npm | https://www.npmjs.com/~perrylink | Los paquetes `dsh-*` con nombre sin scope |
| Gitee | https://gitee.com/perrylink/dsh-plugins | Índice en chino + 5 espejos emblemáticos |
| GitCode | https://gitcode.com/PerryLink/dsh-plugins | Índice en chino + 3 espejos emblemáticos |
| Documentación | https://perrylink.github.io/dsh-plugins/ | Páginas de los paquetes + el índice |

## Notas de nombres

- Todos los paquetes usan nombres sin scope; ya no se usa el scope `@perrylink/`.
- El nombre sin scope original `dsh-eval-harness` lo ocupa otro publicador, así que el proyecto ahora es **`dsh-eval-pack`**; el antiguo paquete con scope `@perrylink/dsh-eval-harness` está deprecado y apunta al nuevo paquete.
- Los antiguos paquetes con scope publicaron sus README finales de redirección y están `npm deprecate`ados hacia los paquetes con nombre sin scope correspondientes.

## Límites

- Todo es public/synthetic, partial, `counted=false`, sin GA.
- Los datos de clientes no deben entrar en el repositorio, las pruebas ni los fixtures; solo se aceptan muestras públicas MIT/Apache.
- Alpha nunca se describe como production-ready, validado por clientes o de precisión demostrada.

Apache-2.0. Véase [PUBLIC-ONLY-BOUNDARY.md](PUBLIC-ONLY-BOUNDARY.md) para más detalles.
