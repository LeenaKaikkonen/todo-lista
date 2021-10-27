const todoTeksti = document.getElementById("todo-teksti");
const lisaaTodoNappi = document.getElementById("lisaa");
const tehtavaLista = document.getElementById("tehtavalista");
const naytaTehtavatNappi = document.getElementById("tehtavat");
const naytaTehdytNappi = document.getElementById("tehdyt");
const naytaKaikkiNappi = document.getElementById("kaikki");

let todoLista = [];
let nayta = 1;

// Haetaan localStorageen stringinä tallennettu lista ja muutetaan se arrayksi käsittelya varten
function haeLista() {
  let nykyinenTodoLista = localStorage.getItem("todoTallennetut");
  if (nykyinenTodoLista == null || nykyinenTodoLista == "") {
    todoLista = [];
  } else {
    todoLista = nykyinenTodoLista.split(",");
  }
}

//tallennetaan arraymoutoinen todoLista stringmuodossa localStorageen
function tallennaLista() {
  localStorage.setItem("todoTallennetut", todoLista.join(","));
}

// Lisätään listalle uusia asioita (edellä luotuun Arrayhin) ja tallennetaan lista stringinä Local Storageen sekä näytetään lista
lisaaTodoNappi.addEventListener("click", function () {
  if (todoTeksti.value == "") {
    alert("Lisää tehtävä");
    return false;
  }

  nayta = 1;
  haeLista();
  todoLista.push(todoTeksti.value);

  tallennaLista();
  naytaTehtavat();
  document.getElementById("todo-teksti").value = null;
});

// valitaan mitä näytä tehtävät / tehdyt / kaikki napit näyttävät
naytaTehdytNappi.addEventListener("click", function () {
  nayta = 2;
  naytaTehtavat();
});

naytaTehtavatNappi.addEventListener("click", function () {
  nayta = 3;
  naytaTehtavat();
});

naytaKaikkiNappi.addEventListener("click", function () {
  nayta = 1;
  naytaTehtavat();
});

let todoHtml = "";

// Funktio jonka perusteella lista näytetään. Tehtävät yliviivataan jos ne on merkitty tehdyiksi (luokka vaihtuu), lisäksi määritetään mitä eri napeista näytetään
function naytaTehtavat() {
  todoLista.forEach((tehtava) => {
    let te = tehtava;

    let rivinluokka = "tekstirivi";
    if (onkoTehty(tehtava)) {
      te = tehtava.substring(1);
      rivinluokka = "tekstirivi2";
    }

    if (
      nayta === 1 ||
      (nayta === 2 && onkoTehty(tehtava)) ||
      (nayta === 3 && !onkoTehty(tehtava))
    ) {
      todoHtml += `<br><div class='todo'><div id=inside>
            <button onclick='poistaTodo("${tehtava}")' type="button" class="poista-nappi">X</button>
          <p class='${rivinluokka}' onclick='teeTodo("${tehtava}")'>&nbsp;&nbsp;${te}&nbsp;&nbsp; </p>
          <button onclick='muokkaaTodo("${tehtava}")' type="button" class="editoi-nappi">Muokkaa</button>
          </div>  
       </div>`;
    }
  });
  tehtavaLista.innerHTML = todoHtml;
  todoHtml = "";
}

// // Muokataan listan tehtäviä muokkaa napista (tehtävä siirtyy editoitavaksi ja häviää listalta)
function muokkaaTodo(tehtava) {
  haeLista();
  let muokattavaIndex = todoLista.indexOf(tehtava);

  document.getElementById("todo-teksti").value = tehtava;

  todoLista.splice(muokattavaIndex, 1);
  tallennaLista();
  naytaTehtavat();
}

// Poistetaan listalta tehtäviä ruksia painamalla
function poistaTodo(tehtava) {
  haeLista();
  let poistettavaIndex = todoLista.indexOf(tehtava);
  todoLista.splice(poistettavaIndex, 1);

  tallennaLista();
  naytaTehtavat();
}

// Tarkistetaan onko tehtävä tehty vai ei (jos stringissä on #, tehtävä on tehty)
function onkoTehty(tehtava) {
  return tehtava.indexOf("#") == 0;
}

// Merkitään tehtävä tehdyksi tai tekemättömäksi klikkaamalla tehtävätekstiä
function teeTodo(tehtava) {
  haeLista();
  let viivattavaIndex = todoLista.indexOf(tehtava);
  if (onkoTehty(tehtava)) {
    todoLista[viivattavaIndex] = tehtava.substring(1);
  } else {
    todoLista[viivattavaIndex] = "#" + tehtava;
  }
  tallennaLista();
  naytaTehtavat();
}

// haetaan localStoragesta kulloinkin olemassa oleva lista näytölle, kun näyttö päivitetään
haeLista();
naytaTehtavat();
