let numeroDeFlujos = 0;
onload = (event)=>{
    //console.log("Se abrio el PRI");
    crearFe();
}
crearFe = () => {
    numeroDeFlujos++;
    for(let i = 1; i<=numeroDeFlujos;i++){
        const flujo = document.createElement("div");
        flujo.innerHTML = `Flujo ${i}: <input type = "text" id = "flujo${i}">`;
        flujos.append(flujo);
        
    }
}
agregar = () => {
    numeroDeFlujos++;
    const flujo = document.createElement("div");
    flujo.innerHTML = `Flujo ${numeroDeFlujos}: <input type = "text" id = "flujo${numeroDeFlujos}">`;
    flujos.append(flujo);
}
function quitar(){
    console.log(numeroDeFlujos)
    if(numeroDeFlujos>=2)
    {
        numeroDeFlujos--;
        flujos.removeChild(flujos.lastElementChild);
    }else alert("estas pendejo te vas a quedar sin flujos")
    
}