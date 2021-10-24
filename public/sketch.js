"use strict";

const btns = document.querySelectorAll(".rubro");

const prod_ref = document.querySelector("#sel_produccion_id");
const cont_ref = document.querySelector("#sel_cont_id");
const asig_ref = document.querySelector("#sel_asignacion_id");
const tiempo_ref = document.querySelector("#sel_tiempo_id");

const btn_agregar = document.querySelector("#btn_agregar_id");
const planilla = document.querySelector(".planilla");

let selasig_container = "";
let rmv_btn = "";
let boton, monto, sel_pos_prod, sel_pos_cont, received, received_cnv;

const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

const findPositions = (first, second) => {
  const indicies = [];
  first.forEach((element, index) => {
    if (second.includes(element)) {
      indicies.push(index);
    }
  });
  return indicies;
};

for (let item of btns) {
  //monitor buttons
  item.addEventListener("click", async () => {
    console.log(`Apretaste el botón: ${item.innerHTML}`);
    boton = item.innerHTML;

    document.querySelector("#subtotal").innerText = `Subtotal $`;

    // Revisar borrar-todo cuándo aprieto botón
    const clean = () => {
      prod_ref.options.length = 0;
      cont_ref.options.length = 0;
      asig_ref.options.length = 0;
      tiempo_ref.options.length = 0;
    };
    clean();

    const data_srv = { btn: item.innerHTML };
    const options = {
      // send server
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data_srv),
    };

    const response = await fetch("/api", options); // SEND-api

    //----------//

    const input_json = await response.json(); // RECEIVE-api */
    received = input_json.data.values;
    //console.log(received);

    // Asignacion menu producciones
    let selected = [];
    for (let step = 0; step < received[0].length; step++) {
      if (received[0][step] == boton) {
        selected.push(received[1][step]); // resultados que son == a botón
      }
    }
    console.log("selected");
    console.log(selected);

    let selected_unique = [...new Set(selected)]; // DISTINCT(resultados)
    console.log("selected_UNIQUE");
    console.log(selected_unique);

    // Fill menu con DISTINCT(resultados)
    for (let step = 0; step < selected_unique.length; step++) {
      if (step == 0) {
        // Producción
        selasig_container = document.querySelector("#sel_produccion_id");
        let opt = document.createElement("option");
        opt.id = "prod-head";
        opt.innerText = `Tipo de producción`;
        selasig_container.appendChild(opt);
        // Personal
        selasig_container = document.querySelector("#sel_cont_id");
        opt = document.createElement("option");
        opt.id = "cont-head";
        opt.innerText = `Categoría de personal`;
        selasig_container.appendChild(opt);
        // Función
        selasig_container = document.querySelector("#sel_asignacion_id");
        opt = document.createElement("option");
        opt.id = "cont-head";
        opt.innerText = `Función`;
        selasig_container.appendChild(opt);
        // Tipo de contratación
        selasig_container = document.querySelector("#sel_tiempo_id");
        opt = document.createElement("option");
        opt.id = "cont-head";
        opt.innerText = `Tipo de contratación`;
        selasig_container.appendChild(opt);
      }
      selasig_container = document.querySelector("#sel_produccion_id");
      const opt = document.createElement("option");
      opt.id = "";
      opt.innerText = `${selected_unique[step]}`;
      selasig_container.appendChild(opt);
    }
  }); // Fin item.addEventListener
} // Fin for(let item of btns)

//Seleccion Producción
prod_ref.addEventListener("click", () => {
  console.log(`CLICK en PROD! con el valor ${prod_ref.value}`);
  let prod_seleccion = prod_ref.value;
  cont_ref.options.length = 0; // Limpio campo inferior

  // Asignacion menu cont
  for (let step = 0; step < received[1].length; step++) {
    if (step == 0) {
      // Personal
      selasig_container = document.querySelector("#sel_cont_id");
      const opt = document.createElement("option");
      opt.id = "cont-head";
      opt.innerText = `Categoría de personal`;
      selasig_container.appendChild(opt);
    }
    if (received[1][step] == prod_seleccion) {
      selasig_container = document.querySelector("#sel_cont_id");
      console.log(received[1][step]);
      const opt = document.createElement("option");
      opt.id = "";
      opt.innerText = `${received[2][step]}`;
      selasig_container.appendChild(opt);
    }
  }
  console.log(
    `FIND POSITION > received[1] ${received[1]} \n ---- \n prod_seleccion ${prod_seleccion} `
  );
  sel_pos_prod = findPositions(received[1], prod_seleccion);
});

// Seleccion cont
cont_ref.addEventListener("click", async () => {
  console.log(`CLICK en cont! con el valor ${cont_ref.value}`);

  asig_ref.options.length = 0; // Limpio campo inferior

  let ind = sel_pos_prod[cont_ref.selectedIndex - 1];

  console.log(`----El CONVENIO----- ind: ${ind}
  \n ------ \n
  sel_pos_prod \n ${sel_pos_prod}
  \n ------ \n 
  sel_pos_prod[cont_ref.selectedIndex - 1] \n
  ${sel_pos_prod[cont_ref.selectedIndex - 1]}`);

  let cnv = received[3][ind]; // el convenio cnv
  console.log(cnv);

  const data_srv_conv = { convenio: cnv };
  const options = {
    // send server
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data_srv_conv),
  };

  const response = await fetch("/apu", options); // SEND-apu

  //----------//

  const input_json = await response.json(); // RECEIVE-apu */
  console.log(input_json);
  received_cnv = input_json.data.values;
  console.log("received_cnv");
  console.log(received_cnv);
  received_cnv[0] = received_cnv[0].map((item) => item.trim());
  received_cnv[1] = received_cnv[1].map((item) => item.trim());
  received_cnv[2] = received_cnv[2].map((item) => item.trim());
  received_cnv[3] = received_cnv[3].map((item) => item.trim());
  console.log("received_cnv");
  console.log(received_cnv);

  // Asignacion menu producciones
  let selected = [];
  for (let step = 0; step < received_cnv[0].length; step++) {
    if (received_cnv[0][step] == cnv) {
      selected.push(received_cnv[1][step]); // resultados que son == a botón
    }
  }
  console.log("selected");
  console.log(selected);

  let selected_unique = [...new Set(selected)]; // DISTINCT(resultados)
  console.log("selected_UNIQUE");
  console.log(selected_unique);

  // Fill menu con DISTINCT(resultados)
  for (let step = 0; step < selected_unique.length; step++) {
    if (step == 0) {
      // Función
      selasig_container = document.querySelector("#sel_asignacion_id");
      const opt = document.createElement("option");
      opt.id = "cont-head";
      opt.innerText = `Función`;
      selasig_container.appendChild(opt);
    }
    selasig_container = document.querySelector("#sel_asignacion_id");
    const opt = document.createElement("option");
    opt.id = "";
    opt.innerText = `${selected_unique[step]}`;
    selasig_container.appendChild(opt);
  }

  /* // revisar
  sel_pos_cont = findPositions(received_cnv[1], asig_ref.value);
  console.log("_______sel_pos_cont------");
  console.log(sel_pos_cont); */
});

asig_ref.addEventListener("click", async () => {
  console.log("click en asig_ref");

  // revisar
  sel_pos_cont = findPositions(received_cnv[1], asig_ref.value);
  console.log("_______sel_pos_cont------");
  console.log(sel_pos_cont);

  let asig_val = asig_ref.value;
  tiempo_ref.options.length = 0; // Limpio campo inferior

  //let ind = sel_pos_cont[asig_ref.selectedIndex];

  // Asignacion menu tiempo
  for (let step = 0; step < received_cnv[1].length; step++) {
    if (step == 0) {
      // Tipo de contratación
      selasig_container = document.querySelector("#sel_tiempo_id");
      const opt = document.createElement("option");
      opt.id = "cont-head";
      opt.innerText = `Tipo de contratación`;
      selasig_container.appendChild(opt);
    }
    if (received_cnv[1][step] == asig_val) {
      selasig_container = document.querySelector("#sel_tiempo_id");
      const opt = document.createElement("option");
      opt.id = "";
      opt.innerText = `${received_cnv[2][step]}`;
      selasig_container.appendChild(opt);
    }
  }
});

tiempo_ref.addEventListener("click", () => {
  let ind = sel_pos_cont[tiempo_ref.selectedIndex - 1];
  monto = received_cnv[3][ind];
  console.log(`received_cnv[3][ind]: ${received_cnv[3][ind]}`);
  console.log(`MONTO: ${monto}`);
  //document.querySelector("#total").innerText = `TOTAL ${received_cnv[3][ind]}`;
  document.querySelector(
    "#subtotal"
  ).innerText = `Subtotal ${received_cnv[3][ind]} `;
});

// Agregar línea a planilla y campos
let num = 0;
let totalItems = 0;
console.log(`tot0-276: ${totalItems}`);

let ids = 0;
btn_agregar.addEventListener("click", () => {
  let linea_contrato = {
    produccion: boton,
    asignacion: asig_ref.value,
    tiempo: tiempo_ref.value,
    salario: monto,
  };

  console.log(`Línea para la planilla ${JSON.stringify(linea_contrato)}`);

  const itemPlanilla = document.createElement("tr");
  itemPlanilla.id = `tr-${ids}`;
  itemPlanilla.className = "seconds";
  itemPlanilla.innerHTML = `<td class="td-uno"><img src="https://www.mercadoaudiovisual.com.ar/app-imgs/tilde.svg"></td>
                            <td class="td-dos">${linea_contrato.asignacion}</td>
                                <td class="td-tres">/ ${
                                  linea_contrato.tiempo
                                }  &ensp; </td>
                                <td class="td-cuatro"> | &ensp; ${formatNumber(
                                  linea_contrato.salario
                                )}</td>
                                <td class="td-cinco"><button class="rmv-btn" onclick="remover(this)"> X </button></td>`;
  planilla.appendChild(itemPlanilla);

  ids++;

  num = Number(
    monto
      .replace(/[\$]/g, "")
      .trim()
      .replace(/[\,]/g, (m) => {
        return m == "," ? "" : "";
      })
  );

  totalItems += num;
  console.log(`tot1-312: ${totalItems}`);

  rmv_btn = document.querySelectorAll(".rmv-btn");

  document.querySelector("#total").innerText = `$ ${formatNumber(
    totalItems.toFixed(2)
  )}`;
  console.log(`tot4-348: ${totalItems}`);
});

function remover(item) {
  console.log("remover is ON");
  let numRest = 0;
  numRest = item.parentNode.parentNode.innerText
    .split(/\$ /)[1]
    .split(/\n/)[0]
    .trim();
  console.log(`numrest: ${numRest}`);
  console.log(`NUM: ${numRest}`);
  console.log(`NUM type: ${typeof numRest}`);
  numRest = numRest.replace(/\,/, "");
  console.log(`NUM post replace: ${numRest}`);
  numRest = Number(numRest);
  totalItems -= numRest;
  console.log(`tot2-332: ${totalItems}`);
  document.querySelector("#total").innerText = `$ ${formatNumber(
    totalItems.toFixed(2)
  )}`;
  console.log(`tot3-338: ${totalItems}`);
  item.parentNode.parentNode.remove();
}
