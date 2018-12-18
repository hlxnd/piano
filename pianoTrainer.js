
var notes=[]

function addForAllOctaves(note) {
    //notes.push(note+",,");
    notes.push(note+",");
    notes.push(note);
    notes.push(note.toLowerCase());
    //notes.push(note.toLowerCase()+"'");
}

for (i=0;i<7;i++) {
    let note = String.fromCharCode(65+i);
    addForAllOctaves(note);
    if ([0, 2, 3, 5, 6].includes(i))
        addForAllOctaves("^"+note);
    if ([0, 1, 3, 5, 6].includes(i))
        addForAllOctaves("_"+note);
}

console.log(notes);

function showNote() {

    let lnote = unote = notes[Math.floor(Math.random() * notes.length)];
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
            scale: 4,
        }
    );
}

window.addEventListener('load', function() { 

    showNote();

    // Prepare keyboard
    var context = new AudioContext();
    var duration = 1;
    playIt = (frequency, time) => {
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

    handleKeyboard = (t,f,x) => {
        console.log(t.getAttribute("freq"));
        t.classList.add('ok');
        playIt(t.getAttribute("freq"),1);
        setTimeout(() => t.classList.remove('ok'), 250);
        showNote();
    }

    makeKey = (i) => {
        let div = document.createElement('div');
        div.addEventListener("click", function(e,f){
            e = window.event || e; 
            if(this === e.target) {
                handleKeyboard(this,f);
            }
        });
        div.classList.add('key');
        div.setAttribute('freq', 130.81 * 1.06 ** i);

        return div;
    }

    var lastDiv;
    for (i = 0; i < 36; i++) {
        let div = makeKey(i);

        if ([1, 3, 6, 8, 10].includes(i % 12))
            lastDiv.appendChild(div);
        else {
            p.appendChild(div);
            lastDiv=div;
        }
    }

    return false;
    }, false)