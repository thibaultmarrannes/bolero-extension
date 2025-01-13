# Bolero Plugin

## Overview

Deze chrome extension maakt het mogelijk om een export te maken van alle transacties binnen Bolero

## Features

- **Feature 1**: Genereert een CSV van alle transacties
- **Feature 2**: Voegt het makelaarsloon toe (kan voorlopig niet met de Bolero export)
- **Feature 3**: Voegt de beurstaks toe (kan voorlopig niet met de Bolero export)
- **Feature 4**: De data wordt standaard nergens online opgeslagen, enkel de CSV wordt lokaal gedownload

## Installation

Deze chrome extensie is niet gepubliceerd. Wat wil zeggen dat deze moet geinstalleerd worden als developer. 

1. Download/clone deze repository
2. Ga op Edge naar edge://extensions, of op Chrome naar chrome://extensions
3. Zet "Developer Mode" aan
4. Klik op de knop "Load Unpacked"
5. Selecteer de uitgepakte extensiemap (nog niet opnieuw inpakken)
6. Zoek naar het puzzelstukje-icoon en zorg ervoor dat de extensie is ingeschakeld
7. En je bent klaar!



## Usage

1. Om de download te starten ga ja naar: https://platform.bolero.be/cash/transaction-history
2. Open de plugin en klik op "Extract Table Data"
3. De plugin gaat eerste maken dat alle rijen beschikbaar zijn (klikken op de laad meer knop) 
4. De plugin gaat nu rij per rij de data ophalen, laat dit gerust zijn gang gaan. Als dit te traag gaat kan je de snelheid wijzigen van 2 seconden naar iets lager (in content.js bestand)
5. Eens alle rijen gecheckt zijn zal chrome automatisch de CSV downloaden

## Contact

Als er vragen zijn rond deze plugin, contacteer [info@thibaultmarrannes.be](mailto:info@thibaultmarrannes).
Werk jij bij Bolero? Maak deze plugin dan gerust overbodig door de functionaliteit in te bouwen in het platform of deze beschikbar te maken via API.
