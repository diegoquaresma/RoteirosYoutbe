export type Language = 'Português' | 'Inglês' | 'Espanhol' | 'Francês';

export interface Script {
  id: string;
  user_id: string;
  title: string;
  language: Language;
  content: string[];
  created_at: string;
  word_count: number;
  token_count: number;
}

export const SYSTEM_MESSAGES: Record<Language, string> = {
  "Português": "Você é um criador de roteiros espirituais. Siga exatamente as instruções fornecidas, gerando o número exato de palavras solicitado, em narrativa fluida, sem emojis, subtítulos ou qualquer formatação como *negrito, *itálico, ou asteriscos (*).",
  "Inglês": "You are a creator of spiritual scripts. Follow the instructions provided exactly, generating the exact number of words requested, in a fluid narrative, without emojis, subtitles, or any formatting like *bold, *italics, or asterisks (*).",
  "Espanhol": "Eres un creador de guiones espirituales. Sigue exactamente las instrucciones proporcionadas, generando el número exacto de palabras solicitado, en una narrativa fluida, sin emojis, subtítulos ni formato como *negrito, *itálico, o asteriscos (*).",
  "Francês": "Vous êtes un créateur de scripts spirituels. Suivez exactement les instructions fournies, en générant le nombre exact de mots requis, dans une narration fluide, sans emojis, sous-titres ou formatage comme *gras, *italique, ou astérisques (*)."
};

export const PROMPTS: Record<Language, string[]> = {
  "Português": [
    "Gere exatamente 600 palavras para uma introdução com uma pergunta ou afirmação impactante que conecte emocionalmente o espectador ao tema '{title}'. Apresente o Espírito Santo como solução, prometendo uma revelação prática e espiritual. Termine com um CTA: 'De onde você está assistindo? Comente sua cidade!'",
    "Gere exatamente 800 palavras para uma narrativa de uma história bíblica relevante para '{title}' (ex.: Moisés, Pedro), com detalhes sensoriais (ex.: 'o vento uivava'). Conecte ao Espírito Santo e sugira B-roll (ex.: 'mostre uma tempestade'). Termine com uma transição: 'O que isso significa para você hoje?'",
    "Gere exatamente 700 palavras para uma analogia visual (ex.: 'fé como uma ponte') para '{title}'. Relacione a desafios cotidianos e dê uma ação prática (ex.: 'ore 5 minutos'). Sugira gráficos (ex.: 'mostre uma ponte'). Termine com CTA: 'O que você faria com essa fé? Comente!'",
    "Gere exatamente 500 palavras para uma provocação para '{title}' (ex.: 'E se uma ação mudasse tudo?'). Prometa uma revelação e sugira B-roll (ex.: 'mostre um horizonte'). Termine com: 'Não saia agora!'",
    "Gere exatamente 1000 palavras para aprofundar '{title}' com uma nova perspectiva (ex.: 'Como ouvir o Espírito'). Use uma história prática e pergunte: 'Onde você precisa confiar mais?' Peça um comentário e inclua CTA de inscrição: 'Inscreva-se para mais!'",
    "Gere exatamente 500 palavras para um gancho para '{title}' (ex.: 'Jesus deixou uma chave escondida?'). Prometa algo novo, sugira B-roll (ex.: 'mostre uma chave'). Termine com: 'Vamos revelar agora!'",
    "Gere exatamente 800 palavras para explorar gratidão para '{title}' com exemplo bíblico (ex.: Paulo e Silas). Relacione a desafios e peça: 'Escreva: Eu sou grato porque...'. Termine com: 'Oraremos juntos em breve.'",
    "Gere exatamente 800 palavras para convidar testemunhos para '{title}' (ex.: 'Quando Deus agiu em sua vida?'). Dê um exemplo, sugira B-roll (ex.: 'mostre um amanhecer'). Termine com CTA: 'Compartilhe nos comentários!'",
    "Gere exatamente 500 palavras para um gancho final para '{title}' (ex.: 'O que Jesus diria sobre seu medo?'). Prometa um clímax, sugira B-roll (ex.: 'mostre uma montanha'). Termine com: 'Fique até o fim!'",
    "Gere exatamente 700 palavras para convidar pedidos de oração para '{title}' (ex.: 'Escreva seu clamor'). Use exemplo bíblico, sugira B-roll (ex.: 'mostre mãos unidas'). Termine com: 'Oraremos juntos em breve.'",
    "Gere exatamente 600 palavras para preparar uma oração para '{title}' com reflexão (ex.: 'O que você entregará?'). Use linguagem sensorial, sugira silêncio visual (ex.: 'mostre um céu calmo'). Termine com: 'Vamos orar agora.'",
    "Gere exatamente 1200 palavras para uma oração poderosa para '{title}', cobrindo fé, cura, paz. Use promessas bíblicas (ex.: 'Por Suas feridas somos curados'). Sugira música suave e termine com CTA: 'Digite Amen!'",
    "Gere exatamente 700 palavras para dar 2-3 ações práticas para '{title}' (ex.: 'Ore 10 minutos'). Relacione com exemplo e peça: 'Escreva seu passo de fé!' Termine com: 'Mais vem por aí.'",
    "Gere exatamente 600 palavras para resumir '{title}' e prometer o próximo tema (ex.: 'Fé no caos'). Inclua CTA: 'Inscreva-se e compartilhe!' Termine com tom inspirador: 'Sua jornada está começando.'",
    "Gere exatamente 800 palavras para convidar uma declaração para '{title}' (ex.: 'Escreva: Eu creio em Deus!'). Use exemplo bíblico (ex.: Abraão), sugira B-roll (ex.: 'mostre uma estrada'). Termine com: 'Fique para a oração.'",
    "Gere exatamente 700 palavras para incentivar o compartilhamento para '{title}' (ex.: 'Envie a quem precisa'). Dê exemplo, sugira CTA: 'Curta e compartilhe!' Termine com gratidão: 'Obrigado por estar aqui.'"
  ],
  "Inglês": [
    "Generate exactly 600 words for an introduction with a striking question or statement that emotionally connects the viewer to the theme '{title}'. Present the Holy Spirit as the solution, promising a practical and spiritual revelation. End with a CTA: 'Where are you watching from? Comment your city!'",
    "Generate exactly 800 words for a narrative of a biblical story relevant to '{title}' (e.g., Moses, Peter), with sensory details (e.g., 'the wind howled'). Connect it to the Holy Spirit and suggest B-roll (e.g., 'show a storm'). End with a transition: 'What does this mean for you today?'",
    "Generate exactly 700 words for a visual analogy (e.g., 'faith as a bridge') for '{title}'. Relate it to everyday challenges and provide a practical action (e.g., 'pray for 5 minutes'). Suggest graphics (e.g., 'show a bridge'). End with CTA: 'What would you do with this faith? Comment!'",
    "Generate exactly 500 words for a teaser for '{title}' (e.g., 'What if one action changed everything?'). Promise a revelation and suggest B-roll (e.g., 'show a horizon'). End with: 'Don't leave now!'",
    "Generate exactly 1000 words to deepen '{title}' with a new perspective (e.g., 'How to hear the Spirit'). Use a practical story and ask: 'Where do you need to trust more?' Request a comment and include a CTA: 'Subscribe for more!'",
    "Generate exactly 500 words for a hook for '{title}' (e.g., 'Did Jesus leave a hidden key?'). Promise something new, suggest B-roll (e.g., 'show a key'). End with: 'Let's reveal it now!'",
    "Generate exactly 800 words to explore gratitude for '{title}' with a biblical example (e.g., Paul and Silas). Relate it to challenges and ask: 'Write: I am grateful because...'. End with: 'We'll pray together soon.'",
    "Generate exactly 800 words to invite testimonies for '{title}' (e.g., 'When did God act in your life?'). Provide an example, suggest B-roll (e.g., 'show a sunrise'). End with CTA: 'Share in the comments!'",
    "Generate exactly 500 words for a final hook for '{title}' (e.g., 'What would Jesus say about your fear?'). Promise a climax, suggest B-roll (e.g., 'show a mountain'). End with: 'Stay until the end!'",
    "Generate exactly 700 words to invite prayer requests for '{title}' (e.g., 'Write your cry'). Use a biblical example, suggest B-roll (e.g., 'show hands united'). End with: 'We'll pray together soon.'",
    "Generate exactly 600 words to prepare a prayer for '{title}' with reflection (e.g., 'What will you surrender?'). Use sensory language, suggest a visual silence (e.g., 'show a calm sky'). End with: 'Let's pray now.'",
    "Generate exactly 1200 words for a powerful prayer for '{title}', covering faith, healing, peace. Use biblical promises (e.g., 'By His wounds we are healed'). Suggest soft music and end with CTA: 'Type Amen!'",
    "Generate exactly 700 words to provide 2-3 practical actions for '{title}' (e.g., 'Pray for 10 minutes'). Relate to an example and ask: 'Write your step of faith!' End with: 'More to come.'",
    "Generate exactly 600 words to summarize '{title}' and promise the next theme (e.g., 'Faith in chaos'). Include CTA: 'Subscribe and share!' End with an inspiring tone: 'Your journey is beginning.'",
    "Generate exactly 800 words to invite a declaration for '{title}' (e.g., 'Write: I believe in God!'). Use a biblical example (e.g., Abraham), suggest B-roll (e.g., 'show a road'). End with: 'Stay for the prayer.'",
    "Generate exactly 700 words to encourage sharing for '{title}' (e.g., 'Send it to someone in need'). Provide an example, suggest CTA: 'Like and share!' End with gratitude: 'Thank you for being here.'"
  ],
  "Espanhol": [
    "Genera exactamente 600 palabras para una introducción con una pregunta o afirmación impactante que conecte emocionalmente al espectador con el tema '{title}'. Presenta al Espíritu Santo como solución, prometiendo una revelación práctica y espiritual. Termina con un CTA: '¿Desde dónde estás viendo? ¡Comenta tu ciudad!'",
    "Genera exactamente 800 palabras para una narrativa de una historia bíblica relevante para '{title}' (ej.: Moisés, Pedro), con detalles sensoriales (ej.: 'el viento aullaba'). Conecta con el Espíritu Santo y sugiere B-roll (ej.: 'muestra una tormenta'). Termina con una transición: '¿Qué significa esto para ti hoy?'",
    "Genera exactamente 700 palabras para una analogía visual (ej.: 'la fe como un puente') para '{title}'. Relaciónala con desafíos cotidianos y da una acción práctica (ej.: 'ora 5 minutos'). Sugiere gráficos (ej.: 'muestra un puente'). Termina con CTA: '¿Qué harías con esta fe? ¡Comenta!'",
    "Genera exactamente 500 palabras para una provocación para '{title}' (ej.: '¿Y si una acción lo cambiara todo?'). Promete una revelación y sugiere B-roll (ej.: 'muestra un horizonte'). Termina con: '¡No te vayas ahora!'",
    "Genera exactamente 1000 palabras para profundizar '{title}' con una nueva perspectiva (ej.: 'Cómo escuchar al Espíritu'). Usa una historia práctica y pregunta: '¿Dónde necesitas confiar más?' Pide un comentario e incluye CTA: '¡Suscríbete para más!'",
    "Genera exactamente 500 palabras para un gancho para '{title}' (ej.: '¿Dejó Jesús una llave escondida?'). Promete algo nuevo, sugiere B-roll (ej.: 'muestra una llave'). Termina con: '¡Vamos a revelarlo ahora!'",
    "Genera exactamente 800 palabras para explorar la gratitud para '{title}' con un ejemplo bíblico (ej.: Pablo y Silas). Relaciónala con desafíos y pide: 'Escribe: Estoy agradecido porque...'. Termina con: 'Oraremos juntos pronto.'",
    "Genera exactamente 800 palabras para invitar testimonios para '{title}' (ej.: '¿Cuándo actuó Dios en tu vida?'). Da un ejemplo, sugiere B-roll (ej.: 'muestra un amanecer'). Termina con CTA: '¡Comparte en los comentarios!'",
    "Genera exactamente 500 palabras para un gancho final para '{title}' (ej.: '¿Qué diría Jesús sobre tu miedo?'). Promete un clímax, sugiere B-roll (ej.: 'muestra una montaña'). Termina con: '¡Quédate hasta el final!'",
    "Genera exactamente 700 palabras para invitar pedidos de oración para '{title}' (ej.: 'Escribe tu clamor'). Usa un ejemplo bíblico, sugiere B-roll (ej.: 'muestra manos unidas'). Termina con: 'Oraremos juntos pronto.'",
    "Genera exactamente 600 palabras para preparar una oración para '{title}' con reflexión (ej.: '¿Qué vas a entregar?'). Usa lenguaje sensorial, sugiere silencio visual (ej.: 'muestra un cielo tranquilo'). Termina con: 'Oremos ahora.'",
    "Genera exactamente 1200 palabras para una oración poderosa para '{title}', cubriendo fe, sanación, paz. Usa promesas bíblicas (ej.: 'Por Sus heridas somos sanados'). Sugiere música suave y termina con CTA: '¡Escribe Amén!'",
    "Genera exactamente 700 palabras para dar 2-3 acciones prácticas para '{title}' (ej.: 'Ora 10 minutos'). Relaciónalas con un ejemplo y pide: '¡Escribe tu paso de fe!' Termina con: 'Más por venir.'",
    "Genera exactamente 600 palabras para resumir '{title}' y prometer el próximo tema (ej.: 'Fe en el caos'). Incluye CTA: '¡Suscríbete y comparte!' Termina con tono inspirador: 'Tu viaje está comenzando.'",
    "Genera exactamente 800 palabras para invitar una declaración para '{title}' (ej.: 'Escribe: ¡Creo en Dios!'). Usa un ejemplo bíblico (ej.: Abraham), sugiere B-roll (ej.: 'muestra un camino'). Termina con: 'Quédate para la oración.'",
    "Genera exactamente 700 palabras para fomentar el compartir para '{title}' (ej.: 'Envíalo a quien lo necesite'). Da un ejemplo, sugiere CTA: '¡Da me gusta y comparte!' Termina con gratitud: 'Gracias por estar aquí.'"
  ],
  "Francês": [
    "Génère exactement 600 mots pour une introduction avec une question ou une affirmation percutante qui connecte émotionnellement le spectateur au thème '{title}'. Présente le Saint-Esprit comme solution, en promettant une révélation pratique et spirituelle. Termine avec un CTA : 'D'où regardes-tu ? Commente ta ville !'",
    "Génère exactement 800 mots pour un récit d'une histoire biblique pertinente pour '{title}' (ex. : Moïse, Pierre), avec des détails sensoriels (ex. : 'le vent hurlait'). Relie-le au Saint-Esprit et suggère un B-roll (ex. : 'montre une tempête'). Termine avec une transition : 'Qu'est-ce que cela signifie pour toi aujourd'hui ?'",
    "Génère exactement 700 mots pour une analogie visuelle (ex. : 'la foi comme un pont') pour '{title}'. Relie-la aux défis quotidiens et donne une action pratique (ex. : 'prie 5 minutes'). Suggère des graphiques (ex. : 'montre un pont'). Termine avec un CTA : 'Que ferais-tu avec cette foi ? Commente !'",
    "Génère exactement 500 mots pour une provocation pour '{title}' (ex. : 'Et si une action changeait tout ?'). Promets une révélation et suggère un B-roll (ex. : 'montre un horizon'). Termine avec : 'Ne pars pas maintenant !'",
    "Génère exactement 1000 mots pour approfondir '{title}' avec une nouvelle perspective (ex. : 'Comment écouter l'Esprit'). Utilise une histoire pratique et demande : 'Où as-tu besoin de faire plus confiance ?' Demande un commentaire et inclus un CTA : 'Inscris-toi pour plus !'",
    "Génère exactement 500 mots pour un accroche pour '{title}' (ex. : 'Jésus a-t-il laissé une clé cachée ?'). Promets quelque chose de nouveau, suggère un B-roll (ex. : 'montre une clé'). Termine avec : 'Révéalons-le maintenant !'",
    "Génère exactement 800 mots pour explorer la gratitude pour '{title}' avec un exemple biblique (ex. : Paul et Silas). Relie-la aux défis et demande : 'Écris : Je suis reconnaissant parce que...'. Termine avec : 'Nous prierons ensemble bientôt.'",
    "Génère exactement 800 mots pour inviter des témoignages pour '{title}' (ex. : 'Quand Dieu a-t-il agi dans ta vie ?'). Donne un exemple, suggère un B-roll (ex. : 'montre un lever de soleil'). Termine avec un CTA : 'Partage dans les commentaires !'",
    "Génère exactement 500 mots pour un accroche final pour '{title}' (ex. : 'Que dirait Jésus de ta peur ?'). Promets un climax, suggère un B-roll (ex. : 'montre une montagne'). Termine avec : 'Reste jusqu'à la fin !'",
    "Génère exactement 700 mots pour inviter des demandes de prière pour '{title}' (ex. : 'Écris ton cri'). Utilise un exemple biblique, suggère un B-roll (ex. : 'montre des mains unies'). Termine avec : 'Nous prierons ensemble bientôt.'",
    "Génère exactement 600 mots pour préparer une prière pour '{title}' avec une réflexion (ex. : 'Que vas-tu abandonner ?'). Utilise un langage sensoriel, suggère un silence visuel (ex. : 'montre un ciel calme'). Termine avec : 'Prions maintenant.'",
    "Génère exactement 1200 mots pour une prière puissante pour '{title}', couvrant la foi, la guérison, la paix. Utilise des promesses bibliques (ex. : 'Par Ses blessures nous sommes guéris'). Suggère une musique douce et termine avec un CTA : 'Écris Amen !'",
    "Génère exactement 700 mots pour donner 2-3 actions pratiques pour '{title}' (ex. : 'Prie 10 minutes'). Relie-les à un exemple et demande : 'Écris ton pas de foi !' Termine avec : 'Plus à venir.'",
    "Génère exactement 600 mots pour résumer '{title}' et promettre le prochain thème (ex. : 'Foi dans le chaos'). Inclus un CTA : 'Inscris-toi et partage !' Termine avec un ton inspirant : 'Ton voyage commence.'",
    "Génère exactement 800 mots pour inviter une déclaration pour '{title}' (ex. : 'Écris : Je crois en Dieu !'). Utilise un exemple biblique (ex. : Abraham), suggère un B-roll (ex. : 'montre une route'). Termine avec : 'Reste pour la prière.'",
    "Génère exactement 700 mots pour encourager le partage pour '{title}' (ex. : 'Envoie-le à quelqu'un dans le besoin'). Donne un exemple, suggère un CTA : 'Aime et partage !' Termine avec gratitude : 'Merci d'être ici.'"
  ]
};