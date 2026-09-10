# Pages folder (Next.js Pages Router)

Acest folder trebuie sa existe la radacina proiectului chiar daca este gol.

In structura FSD layer-ul `pages` se afla in `src/pages`. Daca `pages/` lipseste
de la radacina, Next.js incearca sa foloseasca `src/pages` ca Pages Router si
trateaza fisierele FSD (`index.ts`, `ui/*.tsx`) ca rute, ceea ce strica build-ul
(de exemplu, scoate dependinte server-only precum `pg` / `dns` in bundle-ul de
browser).

Referinta: https://feature-sliced.design/docs/guides/tech/with-nextjs#app-router
