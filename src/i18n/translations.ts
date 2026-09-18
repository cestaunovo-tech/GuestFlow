import { Language } from '../types';

export interface Translations {
  tagline: string;
  howCanWeHelp: string;
  yourRoom: string;
  floor: string;
  building: string;
  changeLanguage: string;
  selectLanguage: string;
  
  // Service Buttons
  cleaning: string;
  towels: string;
  roomService: string;
  contactReception: string;
  reportProblem: string;
  amenities: string;
  breakfast: string;
  luggage: string;
  hotelServices: string;
  discoverDestination: string;
  helpFaq: string;

  // Towels screen
  towelsTitle: string;
  towelsSubtitle: string;
  bathTowels: string;
  handTowels: string;
  faceTowels: string;
  poolTowels: string;
  other: string;
  additionalComments: string;
  requestTowelsBtn: string;
  quantity: string;

  // Door sign
  roomStatusTitle: string;
  cleanRoom: string;
  doNotDisturb: string;
  noCleaningNeeded: string;
  requestCleaningNow: string;
  preferredTime: string;
  morning: string;
  afternoon: string;
  currentStatus: string;
  statusUpdated: string;

  // Room service
  allCategories: string;
  all: string;
  starters: string;
  mainCourses: string;
  desserts: string;
  beverages: string;
  addToCart: string;
  cart: string;
  emptyCart: string;
  confirmOrder: string;
  orderNotes: string;
  allergens: string;
  total: string;
  orderReceived: string;
  inPreparation: string;
  onTheWay: string;
  delivered: string;

  // Report problem
  reportProblemTitle: string;
  isThereAProblem: string;
  selectCategory: string;
  bathroom: string;
  airConditioning: string;
  electricity: string;
  tv: string;
  wifi: string;
  door: string;
  bed: string;
  water: string;
  noise: string;
  attachPhotoOrVideo: string;
  describeIssuePlaceholder: string;
  submitReport: string;
  reported: string;
  assigned: string;
  inProgress: string;
  resolved: string;

  // Contact reception
  receptionTitle: string;
  sendMessage: string;
  requestAssistance: string;
  requestCall: string;
  makeInquiry: string;
  typeMessagePlaceholder: string;
  send: string;
  callRequestedSuccess: string;

  // Requests tracking
  myRequests: string;
  noActiveRequests: string;
  received: string;
  requestCreatedSuccess: string;
  requestNumber: string;
  area: string;

  // Satisfaction
  howWasYourExperience: string;
  rateOurService: string;
  leaveFeedbackPlaceholder: string;
  submitFeedback: string;
  thankYouFeedback: string;

  // Directory & Destination
  directoryTitle: string;
  destinationTitle: string;
  hours: string;
  location: string;
  copyPassword: string;
  passwordCopied: string;
  tips: string;
  distance: string;

  // Smart triage
  autoRoutedNotice: string;
  routedTo: string;
  smartAssistant: string;
  smartAssistantPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    tagline: "Guest Experience & Hotel Operations Platform",
    howCanWeHelp: "¿En qué podemos ayudarte?",
    yourRoom: "Tu habitación",
    floor: "Piso",
    building: "Edificio",
    changeLanguage: "Cambiar idioma",
    selectLanguage: "Selecciona tu idioma",
    
    cleaning: "Limpieza",
    towels: "Toallas",
    roomService: "Room Service",
    contactReception: "Contactar recepción",
    reportProblem: "Reportar problema",
    amenities: "Amenities",
    breakfast: "Desayuno",
    luggage: "Equipaje",
    hotelServices: "Servicios del hotel",
    discoverDestination: "Descubre el destino",
    helpFaq: "Ayuda",

    towelsTitle: "Solicitar Toallas",
    towelsSubtitle: "¿Qué toallas necesitas para tu habitación?",
    bathTowels: "Toallas de baño",
    handTowels: "Toallas de mano",
    faceTowels: "Toallas faciales",
    poolTowels: "Toallas de piscina",
    other: "Otro",
    additionalComments: "Comentarios adicionales (ej. horario preferido)",
    requestTowelsBtn: "Solicitar toallas",
    quantity: "Cantidad",

    roomStatusTitle: "Estado de mi habitación",
    cleanRoom: "Limpiar habitación",
    doNotDisturb: "No molestar",
    noCleaningNeeded: "No necesito limpieza",
    requestCleaningNow: "Solicitar limpieza ahora",
    preferredTime: "Horario preferido de limpieza",
    morning: "Mañana (09:00 - 13:00)",
    afternoon: "Tarde (14:00 - 18:00)",
    currentStatus: "Estado actual de puerta",
    statusUpdated: "El cartel digital se ha actualizado en Housekeeping.",

    allCategories: "Todas las categorías",
    all: "Todos",
    starters: "Entradas",
    mainCourses: "Platos principales",
    desserts: "Postres",
    beverages: "Bebidas",
    addToCart: "Agregar al pedido",
    cart: "Tu Pedido",
    emptyCart: "Tu pedido está vacío",
    confirmOrder: "Confirmar pedido a la habitación",
    orderNotes: "Instrucciones de cocina (ej. sin cebolla, salsa aparte)",
    allergens: "Alérgenos",
    total: "Total",
    orderReceived: "PEDIDO RECIBIDO",
    inPreparation: "EN PREPARACIÓN",
    onTheWay: "EN CAMINO",
    delivered: "ENTREGADO",

    reportProblemTitle: "¿Hay algún problema?",
    isThereAProblem: "Selecciona la categoría del inconveniente:",
    selectCategory: "Categoría",
    bathroom: "Baño",
    airConditioning: "Aire acondicionado",
    electricity: "Electricidad",
    tv: "TV",
    wifi: "Wi-Fi",
    door: "Puerta",
    bed: "Cama",
    water: "Agua",
    noise: "Ruido",
    attachPhotoOrVideo: "Adjuntar foto o evidencia",
    describeIssuePlaceholder: "Describe brevemente el problema para que Mantenimiento asista con las herramientas adecuadas...",
    submitReport: "Enviar reporte de mantenimiento",
    reported: "REPORTADO",
    assigned: "ASIGNADO",
    inProgress: "EN PROCESO",
    resolved: "RESUELTO",

    receptionTitle: "Contactar Recepción",
    sendMessage: "Enviar mensaje directo",
    requestAssistance: "Solicitar asistencia presencial",
    requestCall: "Solicitar llamada a la habitación",
    makeInquiry: "Hacer una consulta",
    typeMessagePlaceholder: "Escribe tu mensaje a recepción...",
    send: "Enviar",
    callRequestedSuccess: "Recepción ha recibido tu solicitud y te contactará en breve.",

    myRequests: "Mis Solicitudes Activas",
    noActiveRequests: "No tienes solicitudes activas en este momento.",
    received: "Recibida",
    requestCreatedSuccess: "Tu solicitud ha sido registrada y enviada al equipo.",
    requestNumber: "Solicitud",
    area: "Área",

    howWasYourExperience: "¿Cómo fue tu experiencia?",
    rateOurService: "Califica la atención recibida para ayudarnos a mejorar:",
    leaveFeedbackPlaceholder: "¿Algún comentario adicional sobre la atención?",
    submitFeedback: "Enviar valoración",
    thankYouFeedback: "¡Muchas gracias por tu valoración!",

    directoryTitle: "Servicios del Hotel",
    destinationTitle: "Descubre el Destino",
    hours: "Horario",
    location: "Ubicación",
    copyPassword: "Copiar clave",
    passwordCopied: "¡Copiado al portapapeles!",
    tips: "Recomendación local",
    distance: "Distancia",

    autoRoutedNotice: "Derivación automática inteligente",
    routedTo: "Derivado automáticamente a",
    smartAssistant: "Asistente exprés: escribe lo que necesitas",
    smartAssistantPlaceholder: "Ej: 'Necesito dos almohadas extra' o 'El control de la TV no enciende'..."
  },
  en: {
    tagline: "Guest Experience & Hotel Operations Platform",
    howCanWeHelp: "How can we help you?",
    yourRoom: "Your Room",
    floor: "Floor",
    building: "Building",
    changeLanguage: "Change Language",
    selectLanguage: "Select your language",

    cleaning: "Housekeeping",
    towels: "Towels",
    roomService: "Room Service",
    contactReception: "Contact Front Desk",
    reportProblem: "Report an Issue",
    amenities: "Amenities",
    breakfast: "Breakfast",
    luggage: "Luggage",
    hotelServices: "Hotel Services",
    discoverDestination: "Explore Destination",
    helpFaq: "Help & FAQ",

    towelsTitle: "Request Towels",
    towelsSubtitle: "Which towels do you need for your room?",
    bathTowels: "Bath towels",
    handTowels: "Hand towels",
    faceTowels: "Face towels",
    poolTowels: "Pool towels",
    other: "Other",
    additionalComments: "Additional notes (e.g. delivery time)",
    requestTowelsBtn: "Request towels",
    quantity: "Quantity",

    roomStatusTitle: "My Room Status",
    cleanRoom: "Clean Room",
    doNotDisturb: "Do Not Disturb",
    noCleaningNeeded: "No cleaning needed",
    requestCleaningNow: "Request cleaning now",
    preferredTime: "Preferred housekeeping window",
    morning: "Morning (09:00 - 13:00)",
    afternoon: "Afternoon (14:00 - 18:00)",
    currentStatus: "Current door status",
    statusUpdated: "Digital door sign updated instantly in Housekeeping.",

    allCategories: "All Categories",
    all: "All",
    starters: "Starters",
    mainCourses: "Main Courses",
    desserts: "Desserts",
    beverages: "Beverages",
    addToCart: "Add to Order",
    cart: "Your Order",
    emptyCart: "Your order is empty",
    confirmOrder: "Confirm Room Delivery",
    orderNotes: "Kitchen instructions (e.g. sauce on side, allergies)",
    allergens: "Allergens",
    total: "Total",
    orderReceived: "ORDER RECEIVED",
    inPreparation: "PREPARING",
    onTheWay: "ON THE WAY",
    delivered: "DELIVERED",

    reportProblemTitle: "Is there any issue?",
    isThereAProblem: "Select the category of your issue:",
    selectCategory: "Category",
    bathroom: "Bathroom",
    airConditioning: "Air Conditioning",
    electricity: "Electricity",
    tv: "TV",
    wifi: "Wi-Fi",
    door: "Door lock",
    bed: "Bedding",
    water: "Water / Plumbing",
    noise: "Noise issue",
    attachPhotoOrVideo: "Attach photo or evidence",
    describeIssuePlaceholder: "Briefly describe the issue so Maintenance brings the right tools...",
    submitReport: "Submit Maintenance Ticket",
    reported: "REPORTED",
    assigned: "ASSIGNED",
    inProgress: "IN PROGRESS",
    resolved: "RESOLVED",

    receptionTitle: "Contact Front Desk",
    sendMessage: "Direct message",
    requestAssistance: "Request in-person assistance",
    requestCall: "Request phone call to room",
    makeInquiry: "General inquiry",
    typeMessagePlaceholder: "Type your message to Front Desk...",
    send: "Send message",
    callRequestedSuccess: "Front Desk received your request and will contact you promptly.",

    myRequests: "My Active Requests",
    noActiveRequests: "You have no active requests right now.",
    received: "Received",
    requestCreatedSuccess: "Your request has been registered and routed to the staff.",
    requestNumber: "Request",
    area: "Department",

    howWasYourExperience: "How was your experience?",
    rateOurService: "Please rate the service to help us maintain peak hospitality:",
    leaveFeedbackPlaceholder: "Any extra comments about this resolution?",
    submitFeedback: "Submit rating",
    thankYouFeedback: "Thank you very much for your feedback!",

    directoryTitle: "Hotel Directory",
    destinationTitle: "Explore Destination",
    hours: "Hours",
    location: "Location",
    copyPassword: "Copy password",
    passwordCopied: "Copied to clipboard!",
    tips: "Local insider tip",
    distance: "Distance",

    autoRoutedNotice: "Smart Auto-Routing",
    routedTo: "Automatically routed to",
    smartAssistant: "Express Concierge: write what you need",
    smartAssistantPlaceholder: "E.g. 'I need two extra feather pillows' or 'AC is making a strange sound'..."
  },
  pt: {
    tagline: "Guest Experience & Hotel Operations Platform",
    howCanWeHelp: "Como podemos ajudar?",
    yourRoom: "Seu Quarto",
    floor: "Andar",
    building: "Edifício",
    changeLanguage: "Alterar idioma",
    selectLanguage: "Selecione seu idioma",

    cleaning: "Limpeza",
    towels: "Toalhas",
    roomService: "Room Service",
    contactReception: "Contatar Recepção",
    reportProblem: "Reportar Problema",
    amenities: "Amenities",
    breakfast: "Café da manhã",
    luggage: "Bagagem",
    hotelServices: "Serviços do Hotel",
    discoverDestination: "Descubra o Destino",
    helpFaq: "Ajuda",

    towelsTitle: "Solicitar Toalhas",
    towelsSubtitle: "De quais toalhas você precisa no quarto?",
    bathTowels: "Toalhas de banho",
    handTowels: "Toalhas de mão",
    faceTowels: "Toalhas de rosto",
    poolTowels: "Toalhas de piscina",
    other: "Outro",
    additionalComments: "Observações adicionais",
    requestTowelsBtn: "Solicitar toalhas",
    quantity: "Quantidade",

    roomStatusTitle: "Estado do meu Quarto",
    cleanRoom: "Limpar quarto",
    doNotDisturb: "Não perturbe",
    noCleaningNeeded: "Não preciso de limpeza",
    requestCleaningNow: "Solicitar limpeza agora",
    preferredTime: "Horário de preferência",
    morning: "Manhã (09:00 - 13:00)",
    afternoon: "Tarde (14:00 - 18:00)",
    currentStatus: "Estado atual da porta",
    statusUpdated: "Sinal digital de porta atualizado para Governanta.",

    allCategories: "Todas as categorias",
    all: "Todos",
    starters: "Entradas",
    mainCourses: "Pratos principais",
    desserts: "Sobremesas",
    beverages: "Bebidas",
    addToCart: "Adicionar ao pedido",
    cart: "Seu Pedido",
    emptyCart: "Seu pedido está vazio",
    confirmOrder: "Confirmar pedido no quarto",
    orderNotes: "Instruções à cozinha",
    allergens: "Alergênicos",
    total: "Total",
    orderReceived: "PEDIDO RECEBIDO",
    inPreparation: "EM PREPARAÇÃO",
    onTheWay: "A CAMINHO",
    delivered: "ENTREGUE",

    reportProblemTitle: "Há algum problema?",
    isThereAProblem: "Selecione o tipo de incidente:",
    selectCategory: "Categoria",
    bathroom: "Banheiro",
    airConditioning: "Ar condicionado",
    electricity: "Eletricidade",
    tv: "TV",
    wifi: "Wi-Fi",
    door: "Fechadura / Porta",
    bed: "Cama",
    water: "Água / Encanamento",
    noise: "Ruído",
    attachPhotoOrVideo: "Anexar foto ou evidência",
    describeIssuePlaceholder: "Descreva o problema para que a Manutenção leve as ferramentas certas...",
    submitReport: "Enviar chamado de manutenção",
    reported: "REPORTADO",
    assigned: "ATRIBUÍDO",
    inProgress: "EM ANDAMENTO",
    resolved: "RESOLVIDO",

    receptionTitle: "Contatar Recepção",
    sendMessage: "Mensagem direta",
    requestAssistance: "Pedir assistência presencial",
    requestCall: "Solicitar ligação ao quarto",
    makeInquiry: "Fazer pergunta",
    typeMessagePlaceholder: "Digite sua mensagem para a recepção...",
    send: "Enviar",
    callRequestedSuccess: "A recepção recebeu seu pedido e entrará em contato em breve.",

    myRequests: "Minhas Solicitações Ativas",
    noActiveRequests: "Você não tem solicitações ativas no momento.",
    received: "Recebida",
    requestCreatedSuccess: "Sua solicitação foi registrada com sucesso.",
    requestNumber: "Chamado",
    area: "Área",

    howWasYourExperience: "Como foi sua experiência?",
    rateOurService: "Avalie nosso atendimento para continuarmos melhorando:",
    leaveFeedbackPlaceholder: "Comentários adicionais sobre o atendimento?",
    submitFeedback: "Enviar avaliação",
    thankYouFeedback: "Muito obrigado pela sua avaliação!",

    directoryTitle: "Diretório do Hotel",
    destinationTitle: "Descubra o Destino",
    hours: "Horário",
    location: "Localização",
    copyPassword: "Copiar senha",
    passwordCopied: "Copiado para a área de transferência!",
    tips: "Dica local",
    distance: "Distância",

    autoRoutedNotice: "Encaminhamento inteligente",
    routedTo: "Encaminhado automaticamente para",
    smartAssistant: "Assistente expresso: escreva o que precisa",
    smartAssistantPlaceholder: "Ex: 'Preciso de mais travesseiros' ou 'O ar condicionado parou'..."
  },
  fr: {
    tagline: "Guest Experience & Hotel Operations Platform",
    howCanWeHelp: "Comment pouvons-nous vous aider ?",
    yourRoom: "Votre Chambre",
    floor: "Étage",
    building: "Bâtiment",
    changeLanguage: "Changer de langue",
    selectLanguage: "Choisissez votre langue",

    cleaning: "Ménage",
    towels: "Serviettes",
    roomService: "Room Service",
    contactReception: "Contacter la Réception",
    reportProblem: "Signaler un problème",
    amenities: "Produits d'accueil",
    breakfast: "Petit-déjeuner",
    luggage: "Bagages",
    hotelServices: "Services de l'hôtel",
    discoverDestination: "Découvrir la région",
    helpFaq: "Aide & FAQ",

    towelsTitle: "Demande de Serviettes",
    towelsSubtitle: "De quelles serviettes avez-vous besoin ?",
    bathTowels: "Serviettes de bain",
    handTowels: "Serviettes pour les mains",
    faceTowels: "Serviettes pour le visage",
    poolTowels: "Serviettes de piscine",
    other: "Autre",
    additionalComments: "Commentaires additionnels",
    requestTowelsBtn: "Commander les serviettes",
    quantity: "Quantité",

    roomStatusTitle: "État de ma chambre",
    cleanRoom: "Nettoyer la chambre",
    doNotDisturb: "Ne pas déranger",
    noCleaningNeeded: "Pas besoin de ménage",
    requestCleaningNow: "Demander le ménage maintenant",
    preferredTime: "Créneau horaire préféré",
    morning: "Matin (09:00 - 13:00)",
    afternoon: "Après-midi (14:00 - 18:00)",
    currentStatus: "Statut actuel de la porte",
    statusUpdated: "Panneau de porte numérique mis à jour pour la gouvernante.",

    allCategories: "Toutes les catégories",
    all: "Tous",
    starters: "Entrées",
    mainCourses: "Plats principaux",
    desserts: "Desserts",
    beverages: "Boissons",
    addToCart: "Ajouter à la commande",
    cart: "Votre Commande",
    emptyCart: "Votre commande est vide",
    confirmOrder: "Confirmer la commande en chambre",
    orderNotes: "Instructions pour la cuisine",
    allergens: "Allergènes",
    total: "Total",
    orderReceived: "COMMANDE REÇUE",
    inPreparation: "EN PRÉPARATION",
    onTheWay: "EN COURS DE LIVRAISON",
    delivered: "LIVRÉ",

    reportProblemTitle: "Y a-t-il un problème ?",
    isThereAProblem: "Sélectionnez la catégorie du souci :",
    selectCategory: "Catégorie",
    bathroom: "Salle de bain",
    airConditioning: "Climatisation",
    electricity: "Électricité",
    tv: "Télévision",
    wifi: "Wi-Fi",
    door: "Serrure / Porte",
    bed: "Literie",
    water: "Eau / Plomberie",
    noise: "Bruit",
    attachPhotoOrVideo: "Joindre une photo",
    describeIssuePlaceholder: "Décrivez le problème afin que la maintenance apporte le bon matériel...",
    submitReport: "Envoyer le signalement",
    reported: "SIGNALÉ",
    assigned: "ASSIGNÉ",
    inProgress: "EN COURS",
    resolved: "RÉSOLU",

    receptionTitle: "Contacter la Réception",
    sendMessage: "Message direct",
    requestAssistance: "Demander une visite en chambre",
    requestCall: "Demander un appel en chambre",
    makeInquiry: "Poser une question",
    typeMessagePlaceholder: "Écrivez votre message à la réception...",
    send: "Envoyer",
    callRequestedSuccess: "La réception a bien reçu votre demande et vous contactera rapidement.",

    myRequests: "Mes Demandes en Cours",
    noActiveRequests: "Vous n'avez aucune demande active pour le moment.",
    received: "Reçue",
    requestCreatedSuccess: "Votre demande a été enregistrée et transmise à l'équipe.",
    requestNumber: "Demande",
    area: "Département",

    howWasYourExperience: "Comment s'est passée votre expérience ?",
    rateOurService: "Notez notre service pour nous aider à nous perfectionner :",
    leaveFeedbackPlaceholder: "Un commentaire sur cette intervention ?",
    submitFeedback: "Envoyer l'avis",
    thankYouFeedback: "Merci infiniment pour votre retour !",

    directoryTitle: "Services de l'Hôtel",
    destinationTitle: "Découvrir la Région",
    hours: "Horaires",
    location: "Emplacement",
    copyPassword: "Copier le mot de passe",
    passwordCopied: "Copié dans le presse-papiers !",
    tips: "Conseil local",
    distance: "Distance",

    autoRoutedNotice: "Routage automatique intelligent",
    routedTo: "Transmis automatiquement à",
    smartAssistant: "Concierge express : écrivez votre demande",
    smartAssistantPlaceholder: "Ex : 'J'ai besoin de deux cintres de plus' ou 'La clim ne souffle plus d'air frais'..."
  },
  de: {
    tagline: "Guest Experience & Hotel Operations Platform",
    howCanWeHelp: "Wie können wir Ihnen helfen?",
    yourRoom: "Ihr Zimmer",
    floor: "Etage",
    building: "Gebäude",
    changeLanguage: "Sprache ändern",
    selectLanguage: "Wählen Sie Ihre Sprache",

    cleaning: "Reinigung",
    towels: "Handtücher",
    roomService: "Zimmerservice",
    contactReception: "Rezeption kontaktieren",
    reportProblem: "Problem melden",
    amenities: "Pflegeartikel",
    breakfast: "Frühstück",
    luggage: "Gepäck",
    hotelServices: "Hotelservices",
    discoverDestination: "Umgebung erkunden",
    helpFaq: "Hilfe & FAQ",

    towelsTitle: "Handtücher anfordern",
    towelsSubtitle: "Welche Handtücher benötigen Sie?",
    bathTowels: "Badetücher",
    handTowels: "Handtücher",
    faceTowels: "Gesichtstücher",
    poolTowels: "Poolhandtücher",
    other: "Sonstige",
    additionalComments: "Zusätzliche Hinweise",
    requestTowelsBtn: "Handtücher anfordern",
    quantity: "Menge",

    roomStatusTitle: "Zimmerstatus",
    cleanRoom: "Zimmer reinigen",
    doNotDisturb: "Bitte nicht stören",
    noCleaningNeeded: "Keine Reinigung benötigt",
    requestCleaningNow: "Jetzt Reinigung anfordern",
    preferredTime: "Bevorzugte Uhrzeit",
    morning: "Vormittags (09:00 - 13:00)",
    afternoon: "Nachmittags (14:00 - 18:00)",
    currentStatus: "Aktueller Türstatus",
    statusUpdated: "Digitales Türschild im Housekeeping aktualisiert.",

    allCategories: "Alle Kategorien",
    all: "Alle",
    starters: "Vorspeisen",
    mainCourses: "Hauptgerichte",
    desserts: "Desserts",
    beverages: "Getränke",
    addToCart: "Zur Bestellung hinzufügen",
    cart: "Ihre Bestellung",
    emptyCart: "Ihre Bestellung ist leer",
    confirmOrder: "Bestellung ans Zimmer aufgeben",
    orderNotes: "Besondere Wünsche für die Küche",
    allergens: "Allergene",
    total: "Gesamt",
    orderReceived: "BESTELLUNG EINGEGANGEN",
    inPreparation: "IN ZUBEREITUNG",
    onTheWay: "UNTERWEGS",
    delivered: "GELIEFERT",

    reportProblemTitle: "Gibt es ein Problem?",
    isThereAProblem: "Wählen Sie die Kategorie des Anliegens:",
    selectCategory: "Kategorie",
    bathroom: "Badezimmer",
    airConditioning: "Klimaanlage",
    electricity: "Elektrizität",
    tv: "Fernseher",
    wifi: "WLAN",
    door: "Türschloss",
    bed: "Bett",
    water: "Wasser / Sanitär",
    noise: "Lärm",
    attachPhotoOrVideo: "Foto anfügen",
    describeIssuePlaceholder: "Beschreiben Sie das Problem kurz für unser Instandhaltungsteam...",
    submitReport: "Meldung absenden",
    reported: "GEMELDET",
    assigned: "ZUGEWIESEN",
    inProgress: "IN BEARBEITUNG",
    resolved: "GELÖST",

    receptionTitle: "Rezeption kontaktieren",
    sendMessage: "Direktnachricht",
    requestAssistance: "Persönliche Hilfe anfordern",
    requestCall: "Rückruf aufs Zimmer anfordern",
    makeInquiry: "Frage stellen",
    typeMessagePlaceholder: "Ihre Nachricht an die Rezeption...",
    send: "Absenden",
    callRequestedSuccess: "Die Rezeption hat Ihre Anfrage erhalten und meldet sich umgehend.",

    myRequests: "Meine aktiven Anfragen",
    noActiveRequests: "Sie haben derzeit keine offenen Anfragen.",
    received: "Eingegangen",
    requestCreatedSuccess: "Ihre Anfrage wurde erfolgreich an das Team übermittelt.",
    requestNumber: "Anfrage",
    area: "Abteilung",

    howWasYourExperience: "Wie war Ihre Erfahrung?",
    rateOurService: "Bitte bewerten Sie unseren Service:",
    leaveFeedbackPlaceholder: "Möchten Sie uns noch etwas mitteilen?",
    submitFeedback: "Bewertung absenden",
    thankYouFeedback: "Vielen Dank für Ihre Rückmeldung!",

    directoryTitle: "Hotelservices",
    destinationTitle: "Umgebung erkunden",
    hours: "Öffnungszeiten",
    location: "Standort",
    copyPassword: "Passwort kopieren",
    passwordCopied: "In Zwischenablage kopiert!",
    tips: "Insider-Tipp",
    distance: "Entfernung",

    autoRoutedNotice: "Intelligente Weiterleitung",
    routedTo: "Automatisch weitergeleitet an",
    smartAssistant: "Express-Concierge: Schreiben Sie Ihr Anliegen",
    smartAssistantPlaceholder: "Z.B.: 'Zwei zusätzliche Kissen bitte' oder 'Klimaanlage kühlt nicht'..."
  },
  it: {
    tagline: "Guest Experience & Hotel Operations Platform",
    howCanWeHelp: "Come possiamo aiutarti?",
    yourRoom: "La tua camera",
    floor: "Piano",
    building: "Edificio",
    changeLanguage: "Cambia lingua",
    selectLanguage: "Seleziona la tua lingua",

    cleaning: "Pulizia",
    towels: "Asciugamani",
    roomService: "Room Service",
    contactReception: "Contatta Reception",
    reportProblem: "Segnala un problema",
    amenities: "Set cortesia",
    breakfast: "Colazione",
    luggage: "Bagagli",
    hotelServices: "Servizi dell'hotel",
    discoverDestination: "Scopri la destinazione",
    helpFaq: "Aiuto & FAQ",

    towelsTitle: "Richiesta Asciugamani",
    towelsSubtitle: "Di quali asciugamani hai bisogno?",
    bathTowels: "Teli da bagno",
    handTowels: "Asciugamani per le mani",
    faceTowels: "Salviette per il viso",
    poolTowels: "Asciugamani da piscina",
    other: "Altro",
    additionalComments: "Note aggiuntive",
    requestTowelsBtn: "Richiedi asciugamani",
    quantity: "Quantità",

    roomStatusTitle: "Stato della mia camera",
    cleanRoom: "Pulisci la camera",
    doNotDisturb: "Non disturbare",
    noCleaningNeeded: "Pulizia non necessaria",
    requestCleaningNow: "Richiedi pulizia adesso",
    preferredTime: "Fascia oraria preferita",
    morning: "Mattina (09:00 - 13:00)",
    afternoon: "Pomeriggio (14:00 - 18:00)",
    currentStatus: "Stato attuale della porta",
    statusUpdated: "Cartellino digitale aggiornato per il reparto ai piani.",

    allCategories: "Tutte le categorie",
    all: "Tutti",
    starters: "Antipasti",
    mainCourses: "Primi e Secondi",
    desserts: "Dolci",
    beverages: "Bevande",
    addToCart: "Aggiungi all'ordine",
    cart: "Il tuo Ordine",
    emptyCart: "Il tuo ordine è vuoto",
    confirmOrder: "Conferma ordine in camera",
    orderNotes: "Indicazioni per la cucina",
    allergens: "Allergeni",
    total: "Totale",
    orderReceived: "ORDINE RICEVUTO",
    inPreparation: "IN PREPARAZIONE",
    onTheWay: "IN ARRIVO",
    delivered: "CONSEGNATO",

    reportProblemTitle: "C'è qualche problema?",
    isThereAProblem: "Seleziona la tipologia di problema:",
    selectCategory: "Categoria",
    bathroom: "Bagno",
    airConditioning: "Aria condizionata",
    electricity: "Elettricità",
    tv: "TV",
    wifi: "Wi-Fi",
    door: "Serratura / Porta",
    bed: "Letto",
    water: "Acqua / Idraulica",
    noise: "Rumore",
    attachPhotoOrVideo: "Allega foto",
    describeIssuePlaceholder: "Descrivi il problema affinché la Manutenzione intervenga con gli strumenti giusti...",
    submitReport: "Invia segnalazione",
    reported: "SEGNALATO",
    assigned: "ASSEGNATO",
    inProgress: "IN CORSO",
    resolved: "RISOLTO",

    receptionTitle: "Contatta Reception",
    sendMessage: "Messaggio diretto",
    requestAssistance: "Richiedi assistenza in camera",
    requestCall: "Richiedi chiamata in camera",
    makeInquiry: "Fai una domanda",
    typeMessagePlaceholder: "Scrivi il tuo messaggio alla reception...",
    send: "Invia",
    callRequestedSuccess: "La reception ha ricevuto la richiesta e ti ricontatterà a breve.",

    myRequests: "Le mie richieste attive",
    noActiveRequests: "Non hai richieste attive in questo momento.",
    received: "Ricevuta",
    requestCreatedSuccess: "La richiesta è stata inoltrata con successo al reparto competente.",
    requestNumber: "Richiesta",
    area: "Reparto",

    howWasYourExperience: "Com'è stata la tua esperienza?",
    rateOurService: "Valuta il servizio ricevuto per aiutarci a migliorare:",
    leaveFeedbackPlaceholder: "Vuoi aggiungere qualche commento?",
    submitFeedback: "Invia valutazione",
    thankYouFeedback: "Grazie mille per la tua recensione!",

    directoryTitle: "Servizi dell'Hotel",
    destinationTitle: "Scopri la Destinazione",
    hours: "Orario",
    location: "Posizione",
    copyPassword: "Copia password",
    passwordCopied: "Copiata negli appunti!",
    tips: "Consiglio locale",
    distance: "Distanza",

    autoRoutedNotice: "Smistamento automatico intelligente",
    routedTo: "Inoltrato automaticamente a",
    smartAssistant: "Concierge espresso: scrivi cosa desideri",
    smartAssistantPlaceholder: "Es: 'Mi servono altri due cuscini' oppure 'L'aria condizionata fa rumore'..."
  }
};
