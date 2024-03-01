
<h1 enter{ color: { to: 'white' } }>Enter / Update / Exit / Restore pattern demo</h1>

<b loop(state.alphabet as letter, i | d => d) text(letter)
    @click{ state.alphabet.splice(i,1) }
    @mouseover{ state.alphabet.splice(i,1) }
    enter{
        'font-size': { default: '12px', to: '48px' },
        color: { to: '#FF0000', duration: 1500 },
        opacity: { default: 0, to: 1, duration: 1500 },
        left: { default: '400px', to: (400 - state.alphabet.length * 15 + i * 30)+'px', ease: 'easeInOutQuint', duration: 1300 + i * 30 },
        top: { default: '0px', to: '280px', ease: 'easeInOutQuint', duration: 1300 + i * 30 },
    }
    update{
        color: { to: '#0088FF' },
        left: { to: (400 - state.alphabet.length * 15 + i * 30)+'px', ease: 'easeOutBounce' },
    }
    exit{
        'font-size': { to: '12px', duration: 1000 },
        color: { to: '#CCCCCC', duration: 1000 },
        top: { to: '550px', duration: 3000 + Math.random() * 2000, ease: 'easeOutBounce' }
    }/>

<i text(state.alphabet.join('')) update{
    opacity: { from: 0, to: 1, duration: 300, done: element => {
        setTimeout(() => {
            this.animateCSS('opacity', { element, from: 1, to: 0, duration: 300 });
        }, 1100);
    }}
}/>


<!state>
    alphabet: []

<!static>
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

<!class>
    connected() {
        this.state.alphabet = alphabet;
        this.render();
        setInterval(() => {
            this.state.alphabet = shuffleArray(alphabet)
                .slice(0, Math.floor(Math.random() * 26))
                .sort();
            this.render();
        }, 2000);
    }

<!style>
    :host {
        width:  100%;
        height: 100%;
        position: absolute;
        top:  0;
        left: 50%;
        transform: translateX(-50%);
        user-select: none;
        -webkit-user-select: none;
        background:black;
    }

    i {
        position: absolute;
        color: white;
        top: 80px;
        left: 50%;
    }

    b {
        font-family: Courier New;
        position: absolute;
        text-align: center;
        width: 30px;
        display: block;
        cursor: pointer;
    }


    h1 {
        font-family: arial;
        font-size: 12px;
        opacity: 0.5;
    }
