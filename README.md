# PYQ Portal

Previous-year question paper discovery for Degree/UG, Junior College/HSC and School (SSC) students.

Stack: Vite + React + React Router + Tailwind CSS. No backend or auth; data is mock/syllabus data in `src/data`.

    npm install
    npm run dev      # local dev server
    npm run build    # production build
    npm run lint     # oxlint

Key files: `src/data/academicConfig.js` (levels), `src/data/mockData.js` (papers),
`src/data/sscData.js` (School), `src/data/universities/mu.js` (Mumbai NEP syllabus),
`src/lib/search.js` (query parsing + ranking), `src/lib/filters.js` (filter panel logic).