# Contributing

This repository indexes the PerryLink DSH domain packages. It is not the place to change a member package's code.

## Before opening a PR

- For a package bug or feature, open the issue on the member repository, not here.
- For an index/docs correction, include the exact file and the reason.
- Run the local gates:

```sh
node scripts/check-taxonomy.mjs
node scripts/build-family.mjs
node scripts/build-docs.mjs
node scripts/check-docs.mjs
```

- Keep the public/synthetic boundary: no customer data, customer evidence, or GA claim.
- One concern per PR; do not bundle unrelated formatting changes.

Apache-2.0.
