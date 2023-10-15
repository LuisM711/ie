let numeroDeFlujos = 0;
onload = (event) => {
    //Aqui basicamente agrego que van a ser 5 flujos inicialmente
    //Y les asigno valores para que no carguen los campos vacios y testear rapido
    agregar();
    agregar();
    agregar();
    agregar();
    tbIi.value = "450";
    flujo1.value = "100";
    flujo2.value = "200";
    flujo3.value = "300";
    flujo4.value = "400";
    tbInteres.value = "";
}

agregar = () => {
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
    try {
        let tir = getTir(problema);
    console.log(`Tir= ${tir}`);
    tbInteres.value = tir.tir;
    mostrarResultados(tir.historial);
    const scrollHeight = document.body.scrollHeight;
    window.scrollTo(0, scrollHeight);
    } catch (error) {
        parrafoSolucion.innerHTML = "El problema no tuvo solución o requiere de demasiado poder computacional";
        tbInteres.value = "No hay"
    }
    
}
getTir = (problema = {}) => {
    let tir = 0;
    let maxIteraciones = 1000; // Número máximo de iteraciones
    let precision = 0.00001; // Precisión requerida
    let tirMin = 0;
    let tirMax = 100;
    let historial = [];
    for (let i = 0; i < maxIteraciones; i++) {
        tir = (tirMin + tirMax) / 2; // Valor promedio del intervaloc
        console.log(tir);
        let vpn = -problema.inversionInicial;
        for (let j = 0; j < problema.flujosDeEfectivo.length; j++) {
            vpn += (problema.flujosDeEfectivo[j]) / Math.pow((1 + (tir / 100)), j + 1);
        }
        historial.push(
            {
                "tir": tir,
                "vpn": vpn
            }
        )
        console.log(historial);
        if (Math.abs(vpn) < precision) {
            return {
                "tir": tir,
                "historial": historial
            }
        }
        if (vpn > 0) {
            tirMin = tir;
        } else {
            tirMax = tir;
        }
    }
    return NaN;
}
// incrustarParrafo = (problema, resultado) => {
//     //Con esto limpio el parrafo del HTML, por si ya tenia texto, para limpiarlo
//     parrafoSolucion.innerHTML = "";
//     //Aqui creo el string que la libreria analiza para generar la fraccion
//     const string = `V.A.E = \\frac{${problema.vpn} * ${problema.r / 100}}{1-\\frac{1}{(1+${problema.r / 100})^${problema.n}}}`;
//     const latex = `\\(${string}\\)`;
//     //Aqui agrego la fraccion y muestro el resultado de VAE en el siguiente renglon
//     parrafoSolucion.innerHTML = latex + `<br><br>\\(V.A.E = ${resultado}\\)`;
//     //Esto es para no mostrar el progreso de renderizado, simplemente mostrar la fraccion ya hecha
//     MathJax.Hub.Config({
//         messageStyle: "none"
//     });
//     MathJax.Hub.Queue(['Typeset', MathJax.Hub, parrafoSolucion]);
// }
function mostrarResultados(resultados) {
    let parrafoSolucion = document.getElementById("parrafoSolucion");
    if (!parrafoSolucion) {
        parrafoSolucion = document.createElement("p");
        parrafoSolucion.id = "parrafoSolucion";
        document.body.appendChild(parrafoSolucion);
    }

    // Limpiamos el contenido previo del párrafo
    parrafoSolucion.innerHTML = "";

    for (let i = 0; i < resultados.length; i++) {
        const resultado = resultados[i];
        const tir = resultado.tir;
        const vpn = resultado.vpn;
        // const linea = `TIR: ${tir}, VPN: ${vpn}`;
        const linea = `VPN(i=${tir}) = ${vpn}`;
        const nodoTexto = document.createTextNode(linea);

        if (i < resultados.length - 1) {
            // Agregamos un salto de línea después de cada línea, excepto la última
            const saltoLinea = document.createElement("br");
            parrafoSolucion.appendChild(nodoTexto);
            parrafoSolucion.appendChild(saltoLinea);
        } else {
            // Si es la última línea, aplicamos estilo subrayado y negritas
            const nodoStrong = document.createElement("strong");
            const nodoSubrayado = document.createElement("u");
            nodoSubrayado.appendChild(nodoTexto);
            nodoStrong.appendChild(nodoSubrayado);
            parrafoSolucion.appendChild(nodoStrong);
        }
    }
}