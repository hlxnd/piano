"use strict";

var notes=[];
var noteCheck=[];
var noteMap=[2,2,3,3,4,5,5,6,6,0,0,1];

function addNote(i) { // 0 -> "C,", 1 -> "^C,"+"_D,", ...
        
    let black=[1, 3, 6, 8, 10].includes(i % 12);

    let note = String.fromCharCode(65+noteMap[i%12]);

    if (i<12)
        note+=",";
    else if (i>24)
        note=note.toLowerCase();

    if (black) {
        notes.push("^"+note);
        noteCheck.push(i);

        note = String.fromCharCode(65+noteMap[(i+1)%12]);
        if (i<12)
            note+=",";
        else if (i>24)
            note=note.toLowerCase();

        notes.push("_"+note);
        noteCheck.push(i);
    }
    else {
        notes.push(note);
        noteCheck.push(i);
    }
}


console.log(notes);

var currentNoteId = 0;

function showNote() {

    let index = Math.floor(Math.random() * notes.length);
    currentNoteId = noteCheck[index];

    let lnote = notes[index],
        unote = lnote;
    console.log(unote.substring(unote.length-1,unote.length));
    if (unote.substring(unote.length-1,unote.length)==',') 
        unote='z';
    else
        lnote='z';

    console.log("unote:"+unote+" lnote:"+lnote);
    console.log('V: 1\n'+unote+'4 |]\nV: 2 clef=bass\n'+lnote+'4 |]');

    // Layout note
    ABCJS.renderAbc(
        'notation', 
        'V: 1\n'+unote+'4 |]\nV: 2 clef=bass\n'+lnote+'4 |]', {
            scale: 2,
            //responsive: "resize"
        }
    );
}


function playIt(frequency, time) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    g.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + duration + time
    );
    o.frequency.value = frequency;
    o.start(time);
}

function handleKeyboard(t,f,x) {
    console.log(t.getAttribute("freq"));
    
    playIt(t.getAttribute("freq"),1);
    
    let state='nok';
    if (currentNoteId==t.getAttribute("noteId")) {
        showNote();
        state='ok';
    }

    t.classList.add(state);
    setTimeout(() => t.classList.remove(state), 250);
}

function makeKey(i) {
    let div = document.createElement('div');
    div.addEventListener("click", function(e,f){
        e = window.event || e; 
        if(this === e.target) {
            handleKeyboard(this,f);
        }
    });
    div.classList.add('key');
    div.setAttribute('freq', 130.81 * 1.06 ** i);
    div.setAttribute('noteId', i);

    return div;
}

var context = new AudioContext();
var duration = 1;

function buildKeyboard() {
    // Prepare keyboard
    var lastDiv;
    for (let i = 0; i < 36; i++) {
        addNote(i);
        let div = makeKey(i);

        if ([1, 3, 6, 8, 10].includes(i % 12))
            lastDiv.appendChild(div);
        else {
            p.appendChild(div);
            lastDiv=div;
        }
    }


}

window.addEventListener('load', function() { 
    buildKeyboard();
    showNote();
    return false;
}, false)