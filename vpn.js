let numeroDeFlujos = 0;
onload = (event) => {
    //Aqui basicamente agrego que van a ser 5 flujos inicialmente
    //Y les asigno valores para que no carguen los campos vacios y testear rapido
    agregar();
    agregar();
    agregar();
    agregar();
    agregar();
    tbIi.value = "20";
    flujo1.value = "3";
    flujo2.value = "4";
    flujo3.value = "5";
    flujo4.value = "6";
    flujo5.value = "8";
    tbInteres.value = "6";
}
agregar = () => {
    numeroDeFlujos++;
    const flujo = document.createElement("div");
    flujo.innerHTML = `Flujo ${numeroDeFlujos}: <input type = "text" id = "flujo${numeroDeFlujos}" onclick = "this.select();" class = "form-control">`;
    flujos.append(flujo);
}
function quitar() {
    //Aqui simplemente se elimina el ultimo hijo del div que tiene los inputs y se decrementa el numero de flujos totales
    console.log(numeroDeFlujos)
    if (numeroDeFlujos >= 2) {
        numeroDeFlujos--;
        flujos.removeChild(flujos.lastElementChild);
    } else alert("estas pendejo te vas a quedar sin flujos")
}
calcular = () => {
    console.clear();
    //Limpio el parrafo de la solucion final por si acaso ya tenia datos
    parrafoSolucion.innerHTML = "";
    //Agrego los flujos de efectivo en un array
    let flujos = [];
    for (let i = 1; i <= numeroDeFlujos; i++) {
        //Accedo a ellos con #flujo${i}, es como poner un document.getElementById('flujo'+i), como los ID son iguales y solo cambia el ultimo digito es mas facil
        flujos.push(Number(document.querySelector(`#flujo${i}`).value));
    }
    //Organizo el problema en un objeto JSON para asi no batallar

    let problema = {
        inversionInicial: Number(tbIi.value),
        flujosDeEfectivo: flujos,
        tasaDeInteres: Number(tbInteres.value)
    }
    //Obtengo el puro VPN
    let vpn = getVpn(problema);
    //Hago un string un poco complejo para que la libreria que uso para las fracciones haga una fraccion bien diseñada y agradable de ver
    let str = `V.P.N = -${problema.inversionInicial} ${getSumatoriaLatex(problema)}`;
    //Incrusto ese string junto con el valor del vpn para mostrarlo en un parrafo
    incrustarParrafo(str, vpn);
    //Mando a llamar a una funcion que toma el vpn y en funcion de eso define si el proyecto es redituable
    hacerAlerta(vpn);
    //Hago que la pagina se vaya al final como si el cliente hubiera deslizado para abajo
    const scrollHeight = document.body.scrollHeight;
    window.scrollTo(0, scrollHeight);
}
getVpn = (problema = {}) => {
    //Proceso para calcular el vpn
    let vpn = 0;
    vpn = -problema.inversionInicial;
    for (let i = 0; i < problema.flujosDeEfectivo.length; i++) {
        vpn += (problema.flujosDeEfectivo[i]) / Math.pow((1 + (problema.tasaDeInteres / 100)), i + 1);
    }
    return vpn;
}
getSumatoriaLatex = (problema = {}) => {
    //Este proceso es algo complejo aunque no tiene mucha ciencia, solo es poner los datos de cierta forma que la libreria lo entienda como fraccion
    let str = "";
    for (let i = 0; i < problema.flujosDeEfectivo.length; i++) {
        str += `+ \\frac{${problema.flujosDeEfectivo[i]}}{(1+${(problema.tasaDeInteres / 100)})^${i + 1}}`
    }
    return str;
}
incrustarParrafo = (string, resultado) => {
    //Con esto limpio el parrafo del HTML, por si ya tenia texto, para limpiarlo
    parrafoSolucion.innerHTML = "";
    //Aqui convierto el string a otro string, aunque lo pude haber hecho antes
    const latex = `\\(${string}\\)`;
    //Aqui agrego la fraccion y muestro el resultado de VPN en el siguiente renglon
    parrafoSolucion.innerHTML = latex + `<br><br>\\(V.P.N = ${resultado}\\)`;
    MathJax.Hub.Config({
        messageStyle: "none"
    });
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, parrafoSolucion]);
}
hacerAlerta = (vpn) => {
    //Si el vpn es positivo o no, va mostrar cierto mensaje
    alertaFinal.innerHTML = "";
    alertaFinal.removeAttribute("class");
    if (vpn > 0) {
        alertaFinal.classList.add("alert", "alert-success");
        alertaFinal.innerText = "El proyecto es redituable debido a que el V.P.N dio positivo";
    }
    else if (vpn < 0) {
        alertaFinal.classList.add("alert", "alert-danger");
        alertaFinal.innerText = "El proyecto NO es redituable debido a que el V.P.N dio negativo";

    }
    else if (vpn == 0) {
        alertaFinal.classList.add("alert", "alert-primary");
        alertaFinal.innerText = "El proyecto se debe replantear porque el V.P.N dio 0";

    }
    else {
        alertaFinal.classList.add("alert", "alert-dark");
        alertaFinal.innerText = "Hubo un error al momento de calcular la factibilidad";
    }
}
