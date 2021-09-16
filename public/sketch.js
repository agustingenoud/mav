"use strict";

//const btns = document.querySelectorAll("button");
const btns = document.querySelectorAll(".rubro");
const asig_ref = document.querySelector("#sel_asignacion_id");
const tiempo_ref = document.querySelector("#sel_tiempo_id");
const btn_agregar = document.querySelector("#btn_agregar_id");
const planilla = document.querySelector(".planilla");

const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

for (let item of btns) {
  item.addEventListener("click", async () => {
    console.log(`Apretaste el botón: ${item.innerHTML}`);

    const data_srv = { btn: item.innerHTML };
    const boton = item.innerHTML;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data_srv),
    };

    const response = await fetch("/api", options); // SEND-api

    //----------//

    const input_json = await response.json(); /* .catch(function (err) {
      console.error(err);
    }); // RECEIVE-api */
    const received = input_json.data.values;

    // Value pair > {"base_comparativa": "salario"}
    const compare = {};
    for (let i = 0; i < received[2].length; i++) {
      let key = received[2][i];
      let value = received[3][i];
      compare[key] = value;
    }

    // Completar SELECT > OPTION
    let menu_item = 0;
    for (let arr of received) {
      // Container p-llenar campos de selects
      var selasig_container = document.querySelector("#sel_asignacion_id");
      menu_item++;
      arr.forEach((item) => {
        if (menu_item == 2) {
          selasig_container = document.querySelector("#sel_tiempo_id");
          const opt = document.createElement("option");
          opt.id = "";
          opt.innerHTML = `<option> ${item} </option>`;
          selasig_container.appendChild(opt);
        } else if (menu_item == 1) {
          selasig_container = document.querySelector("#sel_asignacion_id");
          const opt = document.createElement("option");
          opt.id = "";
          opt.innerHTML = `<option> ${item} </option>`;
          selasig_container.appendChild(opt);
        }
      });
    }

    // Agregar línea a planilla y campos
    let num = 0;
    let totalItems = 0;
    btn_agregar.addEventListener("click", () => {
      const query = `${asig_ref.value}${tiempo_ref.value}`;
      let salario = compare[query];

      let linea_contrato = {
        produccion: boton,
        asignacion: asig_ref.value,
        tiempo: tiempo_ref.value,
        salario: Number(
          salario.replace(/[\,]/g, (m) => {
            return m == "," ? "" : "";
          })
        ),
      };
      console.log(`Línea para la planilla ${JSON.stringify(linea_contrato)}`);

      const itemPlanilla = document.createElement("tr");
      itemPlanilla.className = "seconds";
      itemPlanilla.innerHTML = `<td class="td-uno">${
        linea_contrato.asignacion
      }</td>
                                <td class="td-dos">${linea_contrato.tiempo}</td>
                                <td class="td-tres">${formatNumber(
                                  linea_contrato.salario
                                )}</td>`;
      planilla.appendChild(itemPlanilla);

      num = linea_contrato.salario;
      totalItems += num;
      document.querySelector("#total").innerHTML = `Total: ${formatNumber(
        totalItems
      )}`;
    });
  }); // Fin item.addEventListener
} // Fin for(let item of btns)
