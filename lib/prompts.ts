export const getSummaryPrompt = (text: string) => `
Tu es un assistant pédagogique expert pour lycéens et étudiants français.

Résume ce cours de façon claire et structurée.

Règles STRICTES :
- Maximum 250 mots
- Utilise des titres courts avec ##
- Bullet points pour les points clés
- Vocabulaire accessible lycéen
- Garde TOUS les termes techniques importants
- Pas d'introduction inutile, va direct au contenu

Réponds UNIQUEMENT en JSON valide avec ce format exact :
{
  "summary": "string markdown",
  "key_concepts": ["concept1", "concept2", "concept3"]
}

Cours à résumer :
${text}
`;

export const getFlashcardsPrompt = (text: string) => `
Tu es un expert en mémorisation pour lycéens et étudiants français.

Génère des flashcards de révision à partir de ce cours.

Règles STRICTES :
- Exactement 10 flashcards
- Questions courtes et précises (max 15 mots)
- Réponses courtes et mémorisables (max 30 mots)
- Couvre les notions LES PLUS IMPORTANTES
- Questions variées : définitions, mécanismes, dates, relations cause-effet
- Adapté au niveau scolaire français

Réponds UNIQUEMENT en JSON valide avec ce format exact :
{
  "flashcards": [
    { "question": "string", "answer": "string" }
  ]
}

Cours :
${text}
`;

export const getQCMPrompt = (text: string) => `
Tu es un professeur français créant un QCM de révision.

Génère un QCM à partir de ce cours.

Règles STRICTES :
- Exactement 8 questions
- 4 choix par question (A, B, C, D)
- Une seule bonne réponse par question
- Distracteurs plausibles (pas de fausses réponses évidentes)
- Questions couvrant tout le cours
- Difficulté progressive (facile vers difficile)

Réponds UNIQUEMENT en JSON valide avec ce format exact :
{
  "qcm": [
    {
      "question": "string",
      "choices": { "A": "string", "B": "string", "C": "string", "D": "string" },
      "correct": "A",
      "explanation": "string (max 20 mots)"
    }
  ]
}

Cours :
${text}
`;
