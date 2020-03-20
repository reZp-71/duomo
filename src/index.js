//--- IMPORTA DIPENDENZE ESTERNE
import _ from 'lodash';

//--- IMPORTA DIPENDENZE INTERNE
// import * as Modulo from './modulo.js';

//--- IMPORTA STILE
import './style.scss';

//-- INSERISCI QUI IL TUO CODICE
fetch('http://127.0.0.1:3000/quartieri')
    .then(response => response.json())
    .then(response => _.sortBy(response,"nome") )
    .then(response => console.log(response))