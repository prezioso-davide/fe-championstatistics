# Frontend del Progetto Champions Statistics

Questo documento fornisce un'overview delle funzionalità del frontend e spiega come avviare, configurare e utilizzare il frontend per visualizzare e gestire i dati della competizione UEFA Champions League dal 2016 al 2022.


## Descrizione

Il frontend del progetto Champions Statistics è stato sviluppato utilizzando Angular e PrimeNG per fornire un'interfaccia utente intuitiva e interattiva. 

Il frontend offre tre sezioni principali:

- Sezione Tabelle: Qui gli utenti possono visualizzare e gestire i dati relativi ai giocatori, allenatori, squadre e altre collection. È possibile eseguire operazioni di creazione, lettura, aggiornamento e cancellazione (CRUD) direttamente dalle tabelle.

- Sezione Mappa: In questa sezione, gli utenti possono esplorare una mappa interattiva, selezionando le nazioni da una multiselect sarà possibile visualizzare gli stadi e le squadre associate a ciascuna nazione. Questa sezione offre una prospettiva geografica delle squadre e dei loro luoghi di gioco.

- Sezione Grafici: Qui gli utenti possono visualizzare un grafico, previa selezione di una squadra, che rappresenta il numero di partite giocate da una squadra nelle diverse stagioni dal 2016 al 2023. Questo permette di tracciare il rendimento della squadra nel corso degli anni.


## Prerequisiti

Prima di iniziare, assicurati di avere installato:

Node.js 18.12.1
npm 9.4.1
Angular 16
Visual Studio 


## Installazione

1) Clona il repository del backend dalla repository GitLab.
```
git clone https://github.com/prezioso-davide/fe-championstatistics.git
```

2) Installa le dipendenze
```
npm install
```
*In caso dovessero persistere degli errori, si consiglia di chiudere e riaprire l'IDE.


## Utilizzo

1) Avvia l'applicazione Angular
```
ng serve -o
```

2) Naviga l'applicazione utilizzando un browser all'indirizzo http://localhost:4200.


## Info Utili

Questo progetto universitario è stato realizzato per lo svolgimento dell'esame di Basi di Dati 2, il quale richiedeva l'utilizzo di un database di tipo non relazionale. A tale scopo è stato utilizzato MongoDB.
