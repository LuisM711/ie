let numeroDeFlujos = 0;
onload = (event) => {
  //Aqui basicamente agrego que van a ser 5 flujos inicialmente
  //Y les asigno valores para que no carguen los campos vacios y testear rapido  
  agregar();
  agregar();
  agregar();
  agregar();
  agregar();
  tbIi.value = "1000000";
  flujo1.value = "100000";
  flujo2.value = "150000";
  flujo3.value = "200000";
  flujo4.value = "250000";
  flujo5.value = "300000";

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
  //Limpio el div de la solucion por si ya se habia hecho algun calculo anterior
  solucion.innerHTML = "";
  let flujos = [];
  //Meto los flujos de efectivo en un array
  for (let i = 1; i <= numeroDeFlujos; i++) {
    flujos.push(Number(document.querySelector(`#flujo${i}`).value));
  }
  //Organizo los elementos del problema en un objeto JSON
  let problema = {
    inversionInicial: Number(tbIi.value),
    flujosDeEfectivo: flujos
  }
  //Mando a llamar a una funcion que genera la tabla y me regresa las variables a,b,c y d
  let resultado = generarTabla(problema);
  //calculo el P.R.I con esas variables
  let pri = (resultado.a + (resultado.b - resultado.c) / resultado.d).toFixed(3);
  //Creo un textArea y le doy propiedades
  let textAreaProcedimiento = document.createElement("textarea");
  textAreaProcedimiento.classList.add("form-control", "text-center");
  textAreaProcedimiento.style.height = "200px";
  textAreaProcedimiento.disabled = true;
  textAreaProcedimiento.readOnly = true;
  //Si el proyecto es redituable muestra el calculo, si no, dice que el proyecto no es redituable
  if (resultado.redituable) {
    textAreaProcedimiento.innerHTML =
      `P.R.I = a + (b-c)/d

    P.R.I = ${resultado.a} + (${resultado.b}-${resultado.c})/${resultado.d}

    P.R.I = ${pri};

    La inversión se recupera en ${conversionYear(pri)} `;
  } else textAreaProcedimiento.innerText = "La inversión no es redituable";
  //Al ID html `solucion`, le inserto el textArea creado anteriormente
  solucion.appendChild(textAreaProcedimiento);
  //Hago que la pagina se vaya al final como si el cliente hubiera deslizado para abajo
  const scrollHeight = document.body.scrollHeight;
  window.scrollTo(0, scrollHeight);
}

function generarTabla(objeto) {
  //Convierto en negativo la inversion inicial
  const inversionInicial = -parseFloat(objeto.inversionInicial);
  //Guardo los flujos de efectivo dados por el parametro y los guardo como otro array
  const flujosDeEfectivo = objeto.flujosDeEfectivo.map(parseFloat);
  //Pongo que N equivaldra al total de flujos
  const N = flujosDeEfectivo.length;
  //Creo una tabla HTML
  const tabla = document.createElement("div");
  //Le asigno ID
  tabla.id = "tabla";
  //Meto la tabla en el id `solucion` que viene del HTML
  solucion.appendChild(tabla);
  //De aqui hacia abajo simplemente se crea la tabla, normalmente nunca me aprendo de memoria como se hace, ya que no es tan intuitivo
  const table = document.createElement("table");
  table.classList.add("table");

  // Crea el encabezado de la tabla
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");


  const indicador = document.createElement("th");
  indicador.textContent = "Año";
  headerRow.appendChild(indicador);

  const inversionInicialHeader = document.createElement("th");
  inversionInicialHeader.textContent = "II";
  headerRow.appendChild(inversionInicialHeader);
  //Aqui se muestran todos los flujos en la cabecera de la tabla
  for (let i = 0; i < N; i++) {
    const flujoHeader = document.createElement("th");
    flujoHeader.textContent = `Flujo(${i + 1})`;
    headerRow.appendChild(flujoHeader);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);
  //Aqui creo un objeto que mas adelante sera lo que la funcion retorne
  let conclusion = {
    redituable: false,
    a: 0.0,
    b: 0.0,
    c: 0.0,
    d: 0.0
  }
  // Crea el primer renglón de flujos de efectivo
  const tbody = document.createElement("tbody");
  const inversionInicialRow = document.createElement("tr");
  const FE = document.createElement("td");
  FE.textContent = "FE";
  FE.classList.add("bold");

  inversionInicialRow.appendChild(FE);
  const inversionInicialCell = document.createElement("td");
  inversionInicialCell.textContent = inversionInicial.toLocaleString("es-MX");
  inversionInicialRow.appendChild(inversionInicialCell);
  let primerRenglon = [];
  primerRenglon.push(inversionInicial);
  //Aqui se muestra el valor de cada flujo
  for (const flujo of flujosDeEfectivo) {
    primerRenglon.push(flujo);
    const flujoCell = document.createElement("td");
    flujoCell.textContent = flujo.toLocaleString("es-MX");
    inversionInicialRow.appendChild(flujoCell);
  }
  tbody.appendChild(inversionInicialRow);
  // Crea el segundo renglón de flujo de efectivo acumulado menos inversión inicial
  const flujoAcumuladoRow = document.createElement("tr");
  const FEA_II = document.createElement("td");
  FEA_II.textContent = "FEA-II";
  FEA_II.classList.add("bold");
  flujoAcumuladoRow.appendChild(FEA_II);
  const flujoAcumuladoCell = document.createElement("td");
  flujoAcumuladoCell.textContent = inversionInicial.toLocaleString("es-MX");
  flujoAcumuladoRow.appendChild(flujoAcumuladoCell);

  let acumulado = inversionInicial;

  let segundoRenglon = [];
  segundoRenglon.push(acumulado);
  for (let i = 1; i <= flujosDeEfectivo.length; i++) {
    acumulado += flujosDeEfectivo[i - 1]; // Accede al flujo de efectivo en la posición i - 1
    segundoRenglon.push(acumulado);
    const flujoAcumuladoCell = document.createElement("td");
    flujoAcumuladoCell.textContent = acumulado.toLocaleString("es-MX");

    if (acumulado >= 0 && !conclusion.redituable) {
      //Si ocurre un retorno de inversion se colorea de verde, se prende una bandera y se guarda el valor de `a`
      flujoAcumuladoCell.style.backgroundColor = "green";
      conclusion.redituable = true;
      conclusion.a = i - 1;
    }
    flujoAcumuladoRow.appendChild(flujoAcumuladoCell);
  }
  tbody.appendChild(flujoAcumuladoRow);
  // Crea el tercer renglón de suma de flujos de efectivo
  const sumaFlujosRow = document.createElement("tr");
  const FEA = document.createElement("td");
  FEA.textContent = "FEA";
  FEA.classList.add("bold");

  sumaFlujosRow.appendChild(FEA);
  const sumaFlujosCell = document.createElement("td");
  sumaFlujosCell.textContent = "0".toLocaleString("es-MX");
  sumaFlujosRow.appendChild(sumaFlujosCell);
  let sumaTotal = 0;
  let tercerRenglon = [];
  tercerRenglon.push(sumaTotal);
  for (let i = 0; i < N; i++) {
    sumaTotal += objeto.flujosDeEfectivo[i];
    tercerRenglon.push(sumaTotal);
    const sumaFlujosCell = document.createElement("td");
    sumaFlujosCell.textContent = sumaTotal.toLocaleString("es-MX");
    sumaFlujosRow.appendChild(sumaFlujosCell);
  }
  // console.log(primerRenglon);
  // console.log(segundoRenglon);
  // console.log(tercerRenglon);

  //Aqui se le asigna el valor respectivo a cada variable del P.R.I
  conclusion.b = objeto.inversionInicial;
  conclusion.c = tercerRenglon[conclusion.a];
  conclusion.d = primerRenglon[conclusion.a + 1];
  tbody.appendChild(sumaFlujosRow);
  table.appendChild(tbody);
  // Inyecta la tabla en el div con el id "solucion"
  const solucionTabla = document.getElementById("tabla");
  solucionTabla.innerHTML = '';
  //Aqui se agrega el contenido de la tabla a la tabla, o mejor dicho al DOM que no es otra cosa que la pagina web visible
  solucionTabla.appendChild(table);
  return conclusion;
}

function conversionYear(aniosFloat) {
  // Esta funcion recibe un float y calcula años, meses, dias, minutos y segundos
  const anios = Math.floor(aniosFloat);
  const mesesFloat = (aniosFloat - anios) * 12;
  const meses = Math.floor(mesesFloat);
  const diasFloat = (mesesFloat - meses) * 30; // Suponiendo 30 días por mes
  const dias = Math.floor(diasFloat);
  const horasFloat = (diasFloat - dias) * 24;
  const horas = Math.floor(horasFloat);
  const minutosFloat = (horasFloat - horas) * 60;
  const minutos = Math.floor(minutosFloat);
  const segundosFloat = (minutosFloat - minutos) * 60;
  const segundos = Math.floor(segundosFloat);

  // Crear el formato de cadena con los componentes que tienen valor
  let resultado = '';
  if (anios > 0) {
    resultado += `${anios} año${anios > 1 ? 's' : ''} `;
  }
  if (meses > 0) {
    resultado += `${meses} mes${meses > 1 ? 'es' : ''} `;
  }
  if (dias > 0) {
    resultado += `${dias} día${dias > 1 ? 's' : ''} `;
  }
  if (horas > 0) {
    resultado += `${horas} hora${horas > 1 ? 's' : ''} `;
  }
  if (minutos > 0) {
    resultado += `${minutos} minuto${minutos > 1 ? 's' : ''} `;
  }
  if (segundos > 0) {
    resultado += `${segundos} segundo${segundos > 1 ? 's' : ''} `;
  }

  return resultado.trim(); // Eliminar espacios en blanco al final y al principio
}
