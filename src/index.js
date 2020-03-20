//--- IMPORTA DIPENDENZE ESTERNE
import _ from 'lodash';
//--- IMPORTA DIPENDENZE INTERNE
// import * as Modulo from './modulo.js';

//--- IMPORTA STILE
import './style.scss';
import Duomo from './duomo';
import Grafico from './grafico';

//-- INSERISCI QUI IL TUO CODICE
fetch('http://127.0.0.1:3000/quartieri')
    .then(response => response.json())
    .then(response => _.sortBy(response,"nome") )
    .then(response => {
        //let data = response.map(o=>o.dato);
        let grafico = new Grafico('#grafico', 500, 400);
        grafico.render(response);
    })

let duomo3d = new Duomo('#duomo',400,300);

document.getElementById("ruota").addEventListener("click",()=>{ 
    let angolo = parseFloat( document.getElementById("angolo").value );
    duomo3d.ruotaModello(angolo);
 });

