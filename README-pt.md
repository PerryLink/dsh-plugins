<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugins-hero-en-dark.webp">
  <img src="docs/assets/dsh-plugins-hero-en-light.webp" width="100%" alt="dsh-plugins: o índice da família de plugins DSH da PerryLink — 27 linhas de plugins e 2 suítes distribuídas em 6 famílias de negócio no README.md, junto com packages.json (27 pacotes + 2 suítes), family.json (137 linhas, 126 ativas) e taxonomy.v1.json (91 itens) versionados ao lado; à direita, o número de linhas por família e exemplos de versão">
</picture>

# Plugins de domínio DSH da PerryLink

**O índice da família de plugins DSH da PerryLink: 27 pacotes de domínio + 2 suítes de instalação em um único comando, distribuídos em 6 famílias de negócio, todos com nomes npm sem escopo (`dsh-*`).**

*As tabelas do índice de README.md são o ponto de entrada, `packages.json` e `family.json` são as fontes de dados e `market/index.json` é o que a aba Discover do DSH Desktop lê; este repositório lista apenas demos sintéticas públicas: sem dados de clientes e sem nenhuma alegação de prontidão para produção.*

[English](README.en.md) · [简体中文](README.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-plugins)

</div>

> **Status: alpha / public-synthetic / partial / not counted / not GA.** O agrupamento completo por famílias está em [FAMILY.md](https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md); a taxonomia de quatro eixos está em [TAXONOMY.md](TAXONOMY.md); uma visão filtrável de 137 linhas (126 ativas) está em [taxonomy.html](docs/taxonomy.html). Este índice lista apenas demos sintéticas públicas; não há evidência de clientes, dados de clientes nem alegação de prontidão para produção. SKU-11/14 estão permanentemente DROP.

27 plugins de domínio DSH, todos com **nomes npm sem escopo** (`dsh-*`), organizados em 6 famílias de negócio.

## Instalação

![dsh-plugins execução real em um terminal: node scripts/f1-retrieval.mjs busca no market/index.json com 16 perguntas de tarefas cotidianas e cada pergunta resolve um plugin dsh-* no seu top 3 — taxa de acerto 16/16](docs/assets/dsh-plugins-demo.gif)

*Animado: o stdout real do experimento de recuperação somente leitura do próprio repositório, `node scripts/f1-retrieval.mjs` (repetição de 2026-11-21) — 16 perguntas de tarefas sobre os 136 plugins do `market/index.json`, taxa de acerto 16/16 (100,0 %). Sem rede e sem chamadas ao modelo.*

```sh
dsh plugin --profile <profile> add dsh-ghg
```

Requer DSH `>=0.2.1-rc.3 <0.3.0` e Node `>=24.9 <25`.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugins-flow-v5-dark.svg">
  <img src="docs/assets/dsh-plugins-flow-v5-light.svg" width="100%" alt="estrutura do dsh-plugins: as tabelas do índice junto com packages.json, family.json e taxonomy.v1.json constroem as páginas de docs/ e o market/index.json, e três portões somente leitura — check-taxonomy.mjs, check-docs.mjs e f1-retrieval.mjs — verificam o resultado; o limite é public/synthetic, partial, sem contagem e sem GA">
</picture>

*Estrutura: tabelas do índice → JSON versionados → docs/ e market/index.json → portões somente leitura. Os rótulos do diagrama são os nomes reais de arquivos e scripts, então a mesma imagem serve aos cinco idiomas.*

## Índice

### Finanças (Finance Ops)

| Pacote | Finalidade | Versão | Instalação |
|---|---|---:|---|
| [`dsh-einvoice`](https://github.com/PerryLink/dsh-einvoice) | Ingestão, análise, deduplicação e arquivo local de faturas eletrônicas chinesas (OFD/XML) por arquivo. | `0.2.0` | `dsh plugin --profile <profile> add dsh-einvoice` |
| [`dsh-bankrec`](https://github.com/PerryLink/dsh-bankrec) | Ingestão de extratos bancários / GL / CAMT.053 / MT940, conciliação e um papel de trabalho de três demonstrações. | `0.1.0` | `dsh plugin --profile <profile> add dsh-bankrec` |
| [`dsh-ap-three-way`](https://github.com/PerryLink/dsh-ap-three-way) | Conciliação de três vias fatura / PO / GRN, tolerâncias e um papel de trabalho de exceções. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ap-three-way` |
| [`dsh-travel-recon`](https://github.com/PerryLink/dsh-travel-recon) | Conciliação de reservas de viagem / faturas / extratos de cartão, deduplicação e uma verificação de políticas somente leitura. | `0.1.0` | `dsh plugin --profile <profile> add dsh-travel-recon` |

### Jurídico (Legal Ops)

| Pacote | Finalidade | Versão | Instalação |
|---|---|---:|---|
| [`dsh-legal-intake`](https://github.com/PerryLink/dsh-legal-intake) | Ingestão de solicitações jurídicas em EML, deduplicação de threads e exportação do livro de registro. | `0.1.0` | `dsh plugin --profile <profile> add dsh-legal-intake` |
| [`dsh-legal-clause`](https://github.com/PerryLink/dsh-legal-clause) | Árvore de cláusulas do contrato, mapeamento para o playbook e um relatório de questões abertas. | `0.1.0` | `dsh plugin --profile <profile> add dsh-legal-clause` |

### ESG e qualidade (ESG & Quality)

| Pacote | Finalidade | Versão | Instalação |
|---|---|---:|---|
| [`dsh-ghg`](https://github.com/PerryLink/dsh-ghg) | Ingestão da atividade elétrica, cálculo de GEE, recálculo linha a linha, um papel de trabalho e um pacote ESRS parcial. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ghg` |
| [`dsh-qms-capa`](https://github.com/PerryLink/dsh-qms-capa) | Ingestão de NCR do QMS, aliases de lote, avaliação de impacto, CAPA e 8D. | `0.1.0` | `dsh plugin --profile <profile> add dsh-qms-capa` |

### Comércio e logística (Trade & Logistics)

| Pacote | Finalidade | Versão | Instalação |
|---|---|---:|---|
| [`dsh-hs-candidate`](https://github.com/PerryLink/dsh-hs-candidate) | Candidatos Top-3 de HS, completude dos 12 elementos, portões de RVC e de versão tarifária. | `0.1.0` | `dsh plugin --profile <profile> add dsh-hs-candidate` |
| [`dsh-freight-audit`](https://github.com/PerryLink/dsh-freight-audit) | Versões de tarifas de frete, auditoria de faturas, resumo de recuperação e exportação de desvios. | `0.1.0` | `dsh plugin --profile <profile> add dsh-freight-audit` |

### Documentos e modelos (Docs & Models)

| Pacote | Finalidade | Versão | Instalação |
|---|---|---:|---|
| [`dsh-docx-redline`](https://github.com/PerryLink/dsh-docx-redline) | Verificação de estrutura DOCX, roundtrip byte a byte e substituição de texto em um único run. | `0.1.0` | `dsh plugin --profile <profile> add dsh-docx-redline` |
| [`dsh-ifc-qto`](https://github.com/PerryLink/dsh-ifc-qto) | Extração de componentes IFC / lista de quantidades com exportação em CSV. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ifc-qto` |

### Utilitários de verificação (Verify Utilities)

| Pacote | Finalidade | Versão | Instalação |
|---|---|---:|---|
| [`dsh-policy-ledger`](https://github.com/PerryLink/dsh-policy-ledger) | Diagnóstico de instalação somente leitura: instantâneo de capacidades, asserções de tarball e classificação do log de instalação. | `0.2.0` | `dsh plugin --profile <profile> add dsh-policy-ledger` |
| [`dsh-pim-lint`](https://github.com/PerryLink/dsh-pim-lint) | Lint do catálogo PIM: campos obrigatórios, SKUs duplicados, dígitos verificadores GTIN e preços. | `0.1.0` | `dsh plugin --profile <profile> add dsh-pim-lint` |
| [`dsh-eval-pack`](https://github.com/PerryLink/dsh-eval-pack) | Lint de eval-packs públicos/sintéticos e pontuação JSON determinística. | `0.1.0` | `dsh plugin --profile <profile> add dsh-eval-pack` |
| [`dsh-provider-params`](https://github.com/PerryLink/dsh-provider-params) | Conversão de parâmetros de fornecedores e reparo JSON determinístico. | `0.1.0` | `dsh plugin --profile <profile> add dsh-provider-params` |
| [`dsh-store-replenish`](https://github.com/PerryLink/dsh-store-replenish) | Recomendação de reposição de loja: quantidade sugerida a partir de vendas, estoque e mercadoria em trânsito, sinalizando risco de ruptura e itens de baixo giro. | `0.1.0` | `dsh plugin --profile <profile> add dsh-store-replenish` |
| [`dsh-attendance-check`](https://github.com/PerryLink/dsh-attendance-check) | Verificação de presença e horas extras: importa registros de ponto, compara com as horas padrão e os limites de horas extras, e sinaliza excessos, batidas faltantes e descanso insuficiente. | `0.1.0` | `dsh plugin --profile <profile> add dsh-attendance-check` |
| [`dsh-settlement-docs`](https://github.com/PerryLink/dsh-settlement-docs) | Completude documental da liquidação de obra: monta a lista de documentos por tipo de projeto, verifica itens faltantes, número de cópias, assinaturas e selos, e informa a taxa de completude. | `0.1.0` | `dsh plugin --profile <profile> add dsh-settlement-docs` |
| [`dsh-ar-collection`](https://github.com/PerryLink/dsh-ar-collection) | Cobrança de contas a receber: gera planos de cobrança e minutas de cartas de cobrança em chinês por faixa de idade, e exporta a lista de cobrança. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ar-collection` |
| [`dsh-import-customs-check`](https://github.com/PerryLink/dsh-import-customs-check) | Verificação de documentos de importação: compara os nove campos da fatura, da packing list, do conhecimento de embarque e da declaração aduaneira, e verifica a completude dos 12 elementos de declaração. | `0.1.0` | `dsh plugin --profile <profile> add dsh-import-customs-check` |
| [`dsh-ar-aging`](https://github.com/PerryLink/dsh-ar-aging) | Idade de contas a receber: importa os detalhes a receber, agrupa por idade, resume valores vencidos e principais clientes, e exporta a tabela de idade. | `0.1.0` | `dsh plugin --profile <profile> add dsh-ar-aging` |
| [`dsh-progress-payment`](https://github.com/PerryLink/dsh-progress-payment) | Revisão de pagamentos por medição: confronta a medição em curso com a quantidade e o preço unitário contratados, sinalizando excesso de quantidade, divergência de preço unitário e itens duplicados. | `0.1.0` | `dsh plugin --profile <profile> add dsh-progress-payment` |
| [`dsh-labor-contract`](https://github.com/PerryLink/dsh-labor-contract) | Verificação de contratos de trabalho: verifica cláusulas obrigatórias, limites de período de experiência e proporções salariais, e sinaliza contratos problemáticos em lote. | `0.1.0` | `dsh plugin --profile <profile> add dsh-labor-contract` |
| [`dsh-rfq-compare`](https://github.com/PerryLink/dsh-rfq-compare) | Comparação de RFQ: importa várias cotações, compara item a item e sinaliza cotações abaixo do custo, acima do orçamento e vencidas. | `0.1.0` | `dsh plugin --profile <profile> add dsh-rfq-compare` |
| [`dsh-contract-renewal`](https://github.com/PerryLink/dsh-contract-renewal) | Renovação de contratos: registra início/fim e janelas de renovação, lista contratos a vencer ou já vencidos, e exporta CSV. | `0.1.0` | `dsh plugin --profile <profile> add dsh-contract-renewal` |
| [`dsh-pdf-table`](https://github.com/PerryLink/dsh-pdf-table) | Extrai tabelas da camada de texto de PDF para CSV (documentos digitalizados precisam de OCR antes). | `0.1.0` | `dsh plugin --profile <profile> add dsh-pdf-table` |

As duas suítes também têm espelhos no Gitee / GitCode: [dsh-finops-suite](https://gitee.com/perrylink/dsh-finops-suite) / [dsh-contract-suite](https://gitee.com/perrylink/dsh-contract-suite).

## Artigo de cenário

- [Das faturas às viagens: como funciona uma cadeia de operações financeiras auditável](https://perrylink.github.io/dsh-plugins/articles/finops-suite.html)

## Suítes em um único comando

| Suíte | Membros | Versão | Instalação |
|---|---|---:|---|
| [`dsh-finops-suite`](https://github.com/PerryLink/dsh-finops-suite) | `dsh-einvoice` + `dsh-bankrec` + `dsh-ap-three-way` + `dsh-travel-recon` | `0.1.0-alpha.10` | `dsh plugin --profile <profile> add dsh-finops-suite` |
| [`dsh-contract-suite`](https://github.com/PerryLink/dsh-contract-suite) | `dsh-legal-intake` + `dsh-legal-clause` | `0.1.0-alpha.9` | `dsh plugin --profile <profile> add dsh-contract-suite` |

## Plataformas

| Plataforma | Endereço | Notas |
|---|---|---|
| GitHub | https://github.com/PerryLink/dsh-plugins | Este índice + os repositórios dos pacotes |
| npm | https://www.npmjs.com/~perrylink | Os pacotes `dsh-*` com nome sem escopo |
| Gitee | https://gitee.com/perrylink/dsh-plugins | Índice em chinês + 5 espelhos principais |
| GitCode | https://gitcode.com/PerryLink/dsh-plugins | Índice em chinês + 3 espelhos principais |
| Documentação | https://perrylink.github.io/dsh-plugins/ | Páginas dos pacotes + o índice |

## Notas de nomes

- Todos os pacotes usam nomes sem escopo; o escopo `@perrylink/` não é mais usado.
- O nome sem escopo original `dsh-eval-harness` está com outro publicador, então o projeto agora é **`dsh-eval-pack`**; o antigo pacote com escopo `@perrylink/dsh-eval-harness` está obsoleto e aponta para o novo pacote.
- Os antigos pacotes com escopo publicaram seus READMEs finais de redirecionamento e estão marcados com `npm deprecate` para os pacotes de nome sem escopo correspondentes.

## Limites

- Tudo é public/synthetic, partial, `counted=false`, sem GA.
- Dados de clientes não devem entrar no repositório, nos testes nem nos fixtures; só são aceitas amostras públicas MIT/Apache.
- Alpha nunca é descrito como production-ready, validado por clientes ou de precisão comprovada.

Apache-2.0. Veja [PUBLIC-ONLY-BOUNDARY.md](PUBLIC-ONLY-BOUNDARY.md) para detalhes.
