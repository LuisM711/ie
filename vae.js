let numeroDeFlujos = 0;
onload = (event) => {
    //Aqui basicamente agrego que van a ser 5 flujos inicialmente
    //Y les asigno valores para que no carguen los campos vacios y testear rapido
    crearFe();
    agregar();
    agregar();
    agregar();
    agregar();
    tbIi.value = "10";
    flujo1.value = "3.5";
    flujo2.value = "3.7";
    flujo3.value = "4";
    flujo4.value = "5.5";
    flujo5.value = "6";
    tbInteres.value = "11.3";
}
crearFe = () => {
    //Esta es la logica que implemente para agregar un flujo de efectivo inicial
    numeroDeFlujos++;
    for (let i = 1; i <= numeroDeFlujos; i++) {
        const flujo = document.createElement("div");
        flujo.innerHTML = `Flujo ${i}: <input type = "text" id = "flujo${i}" onclick = "this.select();" class = "form-control">`;
        flujos.append(flujo);
    }
}
agregar = () => {
    //Esto es lo mismo que arriba, solo que con un poco de redundancia para no batallar, pero este agrega campos ya que existe minimo un flujo
    numeroDeFlujos++;
    const flujo = document.createElement("div");
    flujo.innerHTML = `Flujo ${numeroDeFlujos}: <input type = "text" id = "flujo${numeroDeFlujos}" onclick = "this.select();" class = "form-control">`;
    flujos.append(flujo);
}
function quitar() {
    //Aqui simplemente se elimina el ultimo hijo del div que tiene los inputs y se decrementa el numero de flujos totales
    if (numeroDeFlujos >= 2) {
        numeroDeFlujos--;
        flujos.removeChild(flujos.lastElementChild);
    } else alert("estas pendejo te vas a quedar sin flujos")
}
calcular = () => {
    console.clear();
    parrafoSolucion.innerHTML = "";
    //Agrego los flujos en un array
    let flujos = [];
    for (let i = 1; i <= numeroDeFlujos; i++) {
        flujos.push(Number(document.querySelector(`#flujo${i}`).value));
    }
    //Organizo el problema en un objeto JSON para asi no batallar
    let problema = {
        inversionInicial: Number(tbIi.value),
        flujosDeEfectivo: flujos,
        tasaDeInteres: Number(tbInteres.value)
    }
    //Calculo el VPN del problema planteado en la linea 50
    let vpnProblema = getVpn(problema);
    //Organizo ahora el problema que le calculare el VAE en una estructura de datos de tipo objeto llamada JSON
    //JSON : JavaScript Object Notation, es como POO pero sin tener que hacer una clase y todas esas formalidades
    let problemaVae = {
        vpn: vpnProblema,
        r: problema.tasaDeInteres,
        n: problema.flujosDeEfectivo.length
    }
    //Calculo el VAE
    let vae = getVae(problemaVae);
    //Agarro el problema completo y el resultado para mostrarlo en el parrafo
    incrustarParrafo(problemaVae, vae);
    //Hago que la pagina se vaya al final como si el cliente hubiera deslizado para abajo
    const scrollHeight = document.body.scrollHeight;
    window.scrollTo(0, scrollHeight);
}
getVpn = (problema = {}) => {
    //Proceso para obtener el VPN
    let vpn = 0;
    vpn = -problema.inversionInicial;
    for (let i = 0; i < problema.flujosDeEfectivo.length; i++) {
        vpn += (problema.flujosDeEfectivo[i]) / Math.pow((1 + (problema.tasaDeInteres / 100)), i + 1);
    }
    return vpn;
}
getVae = (problema = {}) => {
    let vae = 0;
    vae = problema.vpn * (problema.r/100);
    //Formula del VAE
    vae/=(1 - (1 / Math.pow(1+(problema.r / 100), problema.n)));
    //vae = (problema.vpn * (problema.r)/100) / (1 - (1 / Math.pow(1+(problema.r / 100), problema.n)));
    return vae;
}

incrustarParrafo = (problema,resultado) => {
    //Con esto limpio el parrafo del HTML, por si ya tenia texto, para limpiarlo
    parrafoSolucion.innerHTML = "";
    //Aqui creo el string que la libreria analiza para generar la fraccion
    const string = `V.A.E = \\frac{${problema.vpn} * ${problema.r/100}}{1-\\frac{1}{(1+${problema.r/100})^${problema.n}}}`;
    const latex = `\\(${string}\\)`;
    //Aqui agrego la fraccion y muestro el resultado de VAE en el siguiente renglon
    parrafoSolucion.innerHTML = latex + `<br><br>\\(V.A.E = ${resultado}\\)`;
    //Esto es para no mostrar el progreso de renderizado, simplemente mostrar la fraccion ya hecha
    MathJax.Hub.Config({
        messageStyle: "none"
    });
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, parrafoSolucion]);
}
