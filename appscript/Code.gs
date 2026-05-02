// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAZIONE — modifica solo questi due valori
// ─────────────────────────────────────────────────────────────────────────────

// ID del Google Sheet (si trova nell'URL: docs.google.com/spreadsheets/d/QUI/edit)
const SHEET_ID = 'INSERISCI_ID_FOGLIO_QUI';

// Email a cui inviare la notifica per ogni nuovo modulo ricevuto
const NOTIFY_EMAIL = 'INSERISCI_EMAIL_ALEXIS_QUI';

// ─────────────────────────────────────────────────────────────────────────────
// INTESTAZIONI COLONNE — non modificare
// ─────────────────────────────────────────────────────────────────────────────

const HEADERS = [
  'Data invio',
  // Genitore 1
  'G1 Nome', 'G1 Cognome', 'G1 Età', 'G1 Professione',
  'G1 Email', 'G1 Telefono', 'G1 Codice Fiscale', 'G1 Regione', 'G1 Indirizzo',
  // Genitore 2
  'G2 Nome', 'G2 Cognome', 'G2 Età', 'G2 Professione', 'G2 Email', 'G2 Telefono',
  // Casa
  'Altre persone in casa',
  // Figli
  'Figlio 1 Nome', 'Figlio 1 Età',
  'Figlio 2 Nome', 'Figlio 2 Età',
  'Figlio 3 Nome', 'Figlio 3 Età',
  // Provenienza
  'Come ha conosciuto Alexis', 'Conosceva sleep coaching',
  // Bambino
  'Bambino Nome', 'Bambino Data di nascita',
  // Gravidanza
  'Gravidanza prevista', 'Problemi gravidanza', 'Problemi gravidanza (dettagli)',
  'Tipo parto', 'Complicazioni parto', 'Complicazioni parto (dettagli)',
  'Settimane alla nascita',
  // Medico
  'Problemi medici', 'Problemi medici (dettagli)',
  // Mamma
  'Mamma dorme con bambino', 'Mamma appetito perso', 'Mamma pensieri negativi',
  // Pediatra
  'Pediatra Nome', 'Pediatra escluso problemi sonno', 'Pediatra: può dormire notte', 'Peso bambino',
  // Sviluppo
  'Rotolare', 'Sedersi', 'Strisciare', 'Gattonare', 'Stare in piedi', 'Camminare', 'Prima parola',
  // Alimentazione
  'Tipo latte', 'Vuole continuare allattare', 'Ha iniziato le pappe', 'Pappe (età)', 'Biberon o tazza',
  // Abitudini
  'Succhia pollice/dita', 'Usa ciuccio', 'Ciuccio (quando)', 'Oggetto di sicurezza', 'Melatonina',
  // Comportamento sonno
  'Russa', 'Respira con la bocca', 'Cade dal letto', 'Si muove tanto', 'Suda',
  // Reflusso
  'Reflusso o coliche', 'Reflusso durata', 'Reflusso risolto quando', 'Reflusso cosa ha aiutato',
  // Condizioni mediche
  'Allergie', 'Otiti frequenti', 'Asma', 'Naso chiuso',
  // Incubi
  'Incubi', 'Incubi (frequenza e orario)',
  // Abitudini sonno
  'Disturbi sonno (da quando)', 'Tecniche già provate',
  // Dove dorme
  'Tipo letto', 'Dove dorme attualmente', 'Dove vorrebbero che dormisse', 'Condivide camera', 'Condivide con chi',
  // Routine
  'Routine addormentamento', 'Orario fisso', 'Orario andare a letto', 'Figli tutti insieme a letto',
  // Comportamenti
  'Bambino paura del buio', 'Genitori paura del buio',
  'Angoscia quando solo', 'Angoscia (cosa fa)', 'Batte/dondola testa',
  // Risvegli e temperamento
  'Schema risvegli notturni', 'Temperamento', 'Tempo da solo', 'Auto-calma', 'Altri figli problemi sonno',
  // Programma e obiettivi
  'Programma 24h', 'Obiettivo finale', 'Note'
];

// ─────────────────────────────────────────────────────────────────────────────
// FUNZIONE PRINCIPALE — riceve il form e salva i dati
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName('Moduli');
    if (!sheet) {
      sheet = ss.insertSheet('Moduli');
    }

    // Aggiungi intestazioni se il foglio è vuoto
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const d = e.parameter;

    const row = [
      new Date(),
      // Genitore 1
      d.g1_nome || '', d.g1_cognome || '', d.g1_eta || '', d.g1_professione || '',
      d.g1_email || '', d.g1_telefono || '', d.g1_cf || '', d.g1_regione || '', d.g1_indirizzo || '',
      // Genitore 2
      d.g2_nome || '', d.g2_cognome || '', d.g2_eta || '', d.g2_professione || '',
      d.g2_email || '', d.g2_telefono || '',
      // Casa
      d.altre_persone || '',
      // Figli
      d.figlio1_nome || '', d.figlio1_eta || '',
      d.figlio2_nome || '', d.figlio2_eta || '',
      d.figlio3_nome || '', d.figlio3_eta || '',
      // Provenienza
      d.come_conosciuto || '', d.conosceva_sleep || '',
      // Bambino
      d.bambino_nome || '', d.bambino_nascita || '',
      // Gravidanza
      d.grav_prevista || '', d.grav_problemi || '', d.grav_problemi_testo || '',
      d.tipo_parto || '', d.parto_compl || '', d.parto_compl_testo || '',
      d.settimane_nascita || '',
      // Medico
      d.prob_medici || '', d.prob_medici_testo || '',
      // Mamma
      d.mamma_dorme || '', d.mamma_appetito || '', d.mamma_pensieri || '',
      // Pediatra
      d.pediatra_nome || '', d.ped_escluso || '', d.ped_dormire || '', d.bambino_peso || '',
      // Sviluppo
      d.ms_rotolare || '', d.ms_sedersi || '', d.ms_strisciare || '',
      d.ms_gattonare || '', d.ms_piedi || '', d.ms_camminare || '', d.ms_parola || '',
      // Alimentazione
      d.tipo_latte || '', d.allattare_giorno || '', d.pappe || '', d.pappe_eta_testo || '', d.biberon_tazza || '',
      // Abitudini
      d.pollice || '', d.ciuccio || '', d.ciuccio_quando_testo || '', d.oggetto_sic || '', d.melatonina || '',
      // Comportamento sonno
      d.russa || '', d.bocca || '', d.cade || '', d.muove || '', d.suda || '',
      // Reflusso
      d.reflusso || '', d.reflusso_durata || '', d.reflusso_risolto || '', d.reflusso_aiuto || '',
      // Condizioni mediche
      d.allergie || '', d.otiti || '', d.asma || '', d.naso || '',
      // Incubi
      d.incubi || '', d.incubi_freq || '',
      // Abitudini sonno
      d.disturbi_durata || '', d.tecniche_provate || '',
      // Dove dorme
      d.tipo_letto || '', d.dove_dorme || '', d.dove_ideale || '', d.condivide || '', d.condivide_con_chi || '',
      // Routine
      d.routine_sonno || '', d.orario_fisso || '', d.orario_val || '', d.tutti_insieme || '',
      // Comportamenti
      d.paura_buio || '', d.genitori_buio || '',
      d.angoscia || '', d.angoscia_cosa || '', d.testa || '',
      // Risvegli e temperamento
      d.schema_risvegli || '', d.temperamento || '', d.tempo_solo || '',
      d.auto_calma || '', d.altri_figli_sonno || '',
      // Programma e obiettivi
      d.programma_24h || '', d.obiettivo || '', d.note || ''
    ];

    sheet.appendRow(row);

    // Notifica email ad Alexis
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: '🌙 Nuovo modulo — ' + (d.bambino_nome || '?') + ' (' + (d.g1_nome || '') + ' ' + (d.g1_cognome || '') + ')',
      body: buildEmailBody(d)
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CORPO EMAIL DI NOTIFICA
// ─────────────────────────────────────────────────────────────────────────────

function buildEmailBody(d) {
  const nome = (d.g1_nome || '') + ' ' + (d.g1_cognome || '');
  const bambino = d.bambino_nome || 'N/D';
  const nascita = d.bambino_nascita || 'N/D';

  return [
    'Hai ricevuto un nuovo modulo cliente!',
    '',
    '── GENITORE ─────────────────────────',
    'Nome:     ' + nome,
    'Email:    ' + (d.g1_email || ''),
    'Telefono: ' + (d.g1_telefono || ''),
    'Regione:  ' + (d.g1_regione || ''),
    '',
    '── BAMBINO ──────────────────────────',
    'Nome:          ' + bambino,
    'Data nascita:  ' + nascita,
    'Peso attuale:  ' + (d.bambino_peso || ''),
    '',
    '── OBIETTIVO ────────────────────────',
    d.obiettivo || '',
    '',
    '─────────────────────────────────────',
    'Apri il foglio Google per vedere tutti i dettagli del modulo.'
  ].join('\n');
}
