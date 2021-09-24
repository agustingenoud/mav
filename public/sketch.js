"use strict";

const btns = document.querySelectorAll(".rubro");

const prod_ref = document.querySelector("#sel_produccion_id");
const cont_ref = document.querySelector("#sel_cont_id");
const asig_ref = document.querySelector("#sel_asignacion_id");
const tiempo_ref = document.querySelector("#sel_tiempo_id");

const btn_agregar = document.querySelector("#btn_agregar_id");
const planilla = document.querySelector(".planilla");

let selasig_container = "";
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

    // Value pair > {"base_comparativa": "salario"}
    const compare = {};
    for (let i = 0; i < received[2].length; i++) {
      let key = received[2][i];
      let value = received[3][i];
      compare[key] = value;
    }

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
      selasig_container = document.querySelector("#sel_produccion_id");
      const opt = document.createElement("option");
      opt.id = "";
      opt.innerHTML = `<option> ${selected_unique[step]} </option>`;
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
    if (received[1][step] == prod_seleccion) {
      selasig_container = document.querySelector("#sel_cont_id");
      console.log(received[1][step]);
      const opt = document.createElement("option");
      opt.id = "";
      opt.innerHTML = `<option> ${received[2][step]} </option>`;
      selasig_container.appendChild(opt);
    }
  }
  sel_pos_prod = findPositions(received[1], prod_seleccion);
});

// Seleccion cont
cont_ref.addEventListener("click", async () => {
  console.log(`CLICK en asi! con el valor ${cont_ref.value}`);

  asig_ref.options.length = 0; // Limpio campo inferior

  let ind = sel_pos_prod[cont_ref.selectedIndex];
  console.log("----El CONVENIO-----");
  let cnv = received[3][ind];
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

  const input_json = await response.json(); // RECEIVE-api */
  received_cnv = input_json.data.values;
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
    selasig_container = document.querySelector("#sel_asignacion_id");
    const opt = document.createElement("option");
    opt.id = "";
    opt.innerHTML = `<option> ${selected_unique[step]} </option>`;
    selasig_container.appendChild(opt);
  }
  sel_pos_cont = findPositions(received_cnv[1], asig_ref.value);
  console.log("_______sel_pos_cont------");
  console.log(sel_pos_cont);
});

asig_ref.addEventListener("click", async () => {
  console.log("SALE");
  let asig_val = asig_ref.value;
  tiempo_ref.options.length = 0; // Limpio campo inferior

  let ind = sel_pos_cont[asig_ref.selectedIndex];

  // Asignacion menu tiempo
  for (let step = 0; step < received_cnv[1].length; step++) {
    if (received_cnv[1][step] == asig_val) {
      selasig_container = document.querySelector("#sel_tiempo_id");
      const opt = document.createElement("option");
      opt.id = "";
      opt.innerHTML = `<option> ${received_cnv[2][step]} </option>`;
      selasig_container.appendChild(opt);
    }
  }
});

tiempo_ref.addEventListener("click", () => {
  let ind = sel_pos_cont[tiempo_ref.selectedIndex];
  monto = received_cnv[3][ind];
  //document.querySelector("#total").innerText = `TOTAL ${received_cnv[3][ind]}`;
});

// Agregar línea a planilla y campos
let num = 0;
let totalItems = 0;
btn_agregar.addEventListener("click", () => {
  let linea_contrato = {
    produccion: boton,
    asignacion: asig_ref.value,
    tiempo: tiempo_ref.value,
    salario: monto,
  };
  console.log(`Línea para la planilla ${JSON.stringify(linea_contrato)}`);

  const itemPlanilla = document.createElement("tr");
  itemPlanilla.className = "seconds";
  itemPlanilla.innerHTML = `<td class="td-uno">${linea_contrato.asignacion}</td>
                                <td class="td-dos">${linea_contrato.tiempo}</td>
                                <td class="td-tres">${formatNumber(
                                  linea_contrato.salario
                                )}</td>`;
  planilla.appendChild(itemPlanilla);

  num = Number(
    monto
      .replace(/[\$]/g, "")
      .trim()
      .replace(/[\,]/g, (m) => {
        return m == "," ? "" : "";
      })
  );
  totalItems += num;
  document.querySelector("#total").innerText = `Total $ ${formatNumber(
    totalItems.toFixed(2)
  )}`;
});
