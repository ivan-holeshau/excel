const createFolder = require(__dirname + "/index").createFolder;
const createToken = require(__dirname + "/index").createToken;
const checkConnect = require(__dirname + "/index").checkConnect;
const shell = require("electron").shell;
const createExcel = require(__dirname + "/index").createExcel;
const delToken = require(__dirname + "/index").delToken;
const getTableRows = require(__dirname + "/index").getTableRows;
const parseURL = require(__dirname + "/parser").parseURL;
const updateTable = require(__dirname + "/index").updateTable;
const cv2json = require("convert-excel-to-json");
const lodash = require("lodash");

const checkNumBox = document.querySelector("#addNumberBox"); //
const selectorNumBox = document.querySelector(".selector-number-box"); //
const viewsAuthBtn = document.querySelector(".log"); //
const formAuth = document.querySelector(".form-auth"); //
const authInput = document.querySelector(".input-auth");
const btnLogIn = document.querySelector(".btn-log-in");
const btnLogOut = document.querySelector(".btn-log-out");
const messageAuthTrue = document.querySelector(".auth-true-mes");
const messageAuthFalse = document.querySelector(".auth-false-mes");
const alertNotAuth = document.querySelector(".alert-not-auth");
const card = document.querySelector(".card");
const linkTable = document.querySelector("#linkTable");
const progressBar = document.querySelector(".progress-bar");
const progressDiv = document.querySelector(".progress");
const reWriteChecked = document.querySelector("#re-write-checked");
const btnEditTable = document.querySelector(".btn-edit-table");
const selectedFileWithBox = document.querySelector("#selected-file-with-box");
const btnCancelEditTable = document.querySelector(".btn-cancel-edit-table");
const spanEditCompleted = document.querySelector(".span-edit-completed");
const spanEditCancel = document.querySelector(".span-edit-cancel");
const selectActions = document.querySelector("#select-actions");
const actionDiv = document.querySelectorAll(".action-div");
const alertBadLinkTable = document.querySelector(".bad-link");
const addNumBoxInTable = document.querySelector(".btn-add-num-box-in-table");
const alertBadFilesBox = document.querySelector(".bad-files-box");
const countFilesBoxSelected = document.querySelector(".count-files-box");

let lastId = 0;
let canEditTable = false;

if (card) {
  (async function () {
    await checkAuth();
  })();
}

async function logIn() {
  getTocken();
  btnLogIn.setAttribute("disabled", true);
  setTimeout(async () => {
    const status = await checkAuth();

    if (status) {
      addClass(formAuth, "d-none");
      authInput.value = "";
      authInput.setAttribute("readonly", true);
    }
    btnLogIn.removeAttribute("disabled");
  }, 3000);
}

async function logOut() {
  await delToken();
  await checkAuth();
}

function addClass(el, addClass) {
  if (!el.classList.contains(addClass)) {
    el.classList.add(addClass);
  }
}

async function checkAuth() {
  let auth = await checkConnect();
  if (auth) {
    addClass(viewsAuthBtn, "d-none");
    addClass(alertNotAuth, "d-none");

    messageAuthTrue.classList.remove("d-none");
    btnLogOut.classList.remove("d-none");
    card.classList.remove("d-none");
  } else {
    addClass(messageAuthTrue, "d-none");
    addClass(btnLogOut, "d-none");
    addClass(card, "d-none");

    alertNotAuth.classList.remove("d-none");
    viewsAuthBtn.classList.remove("d-none");
    messageAuthFalse.classList.remove("d-none");
    btnLogIn.setAttribute("disabled", true);
    setTimeout(() => {
      addClass(messageAuthFalse, "d-none");
      btnLogIn.removeAttribute("disabled");
    }, 1000);
  }

  return auth;
}

function checkBoxChecked() {
  if (checkNumBox.checked) {
    checkNumBox.removeAttribute("checked");
    selectorNumBox.classList.remove("d-none");
  } else {
    checkNumBox.setAttribute("checked", true);
    selectorNumBox.classList.add("d-none");
  }
}

function viewAuth() {
  if (formAuth.classList.contains("d-none")) {
    formAuth.classList.remove("d-none");
  } else {
    formAuth.classList.add("d-none");
  }
}

document.addEventListener("click", (e) => {
  if (
    !formAuth.classList.contains("d-none") &&
    !e.target.classList.contains("log") &&
    !formAuth.contains(e.target)
  ) {
    formAuth.classList.add("d-none");
  }
});

function activeInput() {
  authInput.removeAttribute("readonly");
}

function hideAndShow(hidenArr = [], showArr = []) {
  if (hidenArr.length !== 0) {
    hidenArr.forEach((el) => {
      if (!el.classList.contains("d-none")) {
        el.classList.add("d-none");
      }
    });
  }
  if (showArr.length !== 0) {
    showArr.forEach((el) => {
      el.classList.remove("d-none");
    });
  }
}

function changeActionOnTable() {
  const selectedAction = selectActions.selectedIndex;
  const hidenArr = [];
  const showArr = [];
  if (selectedAction === "0") {
    actionDiv.forEach((item) => {
      hidenArr.push(item);
    });
  } else {
    actionDiv.forEach((item, index) => {
      if (selectedAction === index + 1) {
        showArr.push(item);
      } else {
        hidenArr.push(item);
      }
    });
  }

  hideAndShow(hidenArr, showArr);
}

let gen = createToken();

function addFolder(event) {
  try {
    const fileName = document.getElementById("nameFolder").value;

    createFolder("exlRootState");
  } catch {}
}

function aut() {
  gen = createToken();

  const link = gen.next();
  shell.openExternal(link.value);

  activeInput();
}

async function getTocken() {
  const token = authInput.value;
  gen.next(token);
}

async function newExcel() {
  const a = await checkConnect();
  if (a) {
    createExcel();
  } else {
  }
}

async function getLinks() {
  addClass(alertBadLinkTable, "d-none");
  const arrsLinks = await getTableRows(linkTable.value, "C2:E3000");

  if (!(arrsLinks === null)) {
    activeEditTable();
    const reWrite = reWriteChecked.checked;
    let dataParse = {};
    const arrsLinkArtName = [];

    for (let i = 0; i < arrsLinks.length; i++) {
      if (canEditTable) {
        setProcent(arrsLinks.length, i);

        if (arrsLinks[i].length !== 0) {
          if (arrsLinks[i][0] !== "") {
            let link = validLink(arrsLinks[i][0]);

            if (link && link.includes("sima-land.ru")) {
              if (reWrite) {
                dataParse = await parseURL(link, i + 2);
                await new Promise((resolve, reject) => setTimeout(resolve, 50));
                arrsLinkArtName.push([
                  arrsLinks[i][0],
                  dataParse.article,
                  dataParse.title,
                ]);
              } else {
                if (arrsLinks[i].length === 1) {
                  dataParse = await parseURL(link, i + 2);
                  await new Promise((resolve, reject) =>
                    setTimeout(resolve, 50)
                  );
                  arrsLinkArtName.push([
                    arrsLinks[i][0],
                    dataParse.article,
                    dataParse.title,
                  ]);
                } else {
                  if (arrsLinks[i].length === 2) {
                    dataParse = await parseURL(link, i + 2);
                    await new Promise((resolve, reject) =>
                      setTimeout(resolve, 50)
                    );
                    arrsLinkArtName.push([
                      arrsLinks[i][0],
                      arrsLinks[i][1],
                      dataParse.title,
                    ]);
                  } else {
                    if (arrsLinks[i].length === 3 && arrsLinks[i][1] === "") {
                      dataParse = await parseURL(link, i + 2);
                      await new Promise((resolve, reject) =>
                        setTimeout(resolve, 50)
                      );
                      arrsLinkArtName.push([
                        arrsLinks[i][0],
                        dataParse.article,
                        arrsLinks[i][2],
                      ]);
                    } else {
                      if (arrsLinks[i].length === 3) {
                        arrsLinkArtName.push([
                          arrsLinks[i][0],
                          arrsLinks[i][1],
                          arrsLinks[i][2],
                        ]);
                      }
                    }
                  }
                }
              }
            } else {
              if (arrsLinks[i].length === 1) {
                arrsLinkArtName.push([arrsLinks[i][0], "", ""]);
              } else {
                if (arrsLinks[i].length === 2) {
                  arrsLinkArtName.push([arrsLinks[i][0], arrsLinks[i][1], ""]);
                } else {
                  arrsLinkArtName.push([
                    arrsLinks[i][0],
                    arrsLinks[i][1],
                    arrsLinks[i][2],
                  ]);
                }
              }
            }
          } else {
            if (arrsLinks[i].length === 2) {
              arrsLinkArtName.push([arrsLinks[i][0], arrsLinks[i][1], ""]);
            } else {
              arrsLinkArtName.push([
                arrsLinks[i][0],
                arrsLinks[i][1],
                arrsLinks[i][2],
              ]);
            }
          }
        } else {
          arrsLinkArtName.push(["", "", ""]);
        }
      } else {
        cancelEditTable();
        addClass(card, ".card-edit-cancel");
        spanEditCancel.classList.remove("d-none");
        setTimeout(() => {
          card.classList.remove(".card-edit-cancel");
        }, 500);
        setTimeout(() => {
          addClass(spanEditCancel, "d-none");
          btnEditTable.removeAttribute("disabled");
        }, 2000);
        break;
      }
    }

    btnCancelEditTable.setAttribute("disabled", "disabled");
    if (canEditTable) {
      const num = arrsLinkArtName.length + 1;
      const updated = await updateTable(
        linkTable.value,
        `C2:E${num}`,
        arrsLinkArtName
      );
      cancelEditTable();

      if (updated) {
        addClass(card, "card-edit-completed");
        spanEditCompleted.classList.remove("d-none");
        setTimeout(() => {
          card.classList.remove("card-edit-completed");
        }, 500);
        setTimeout(() => {
          addClass(spanEditCompleted, "d-none");
          btnEditTable.removeAttribute("disabled");
        }, 2000);
      } else {
        addClass(card, "card-edit-cancel");
        spanEditCancel.classList.remove("d-none");
        setTimeout(() => {
          card.classList.remove("card-edit-cancel");
        }, 500);
        setTimeout(() => {
          addClass(spanEditCancel, "d-none");
          btnEditTable.removeAttribute("disabled");
        }, 2000);
      }
    } else {
      cancelEditTable();
      addClass(card, "card-edit-cancel");
      spanEditCancel.classList.remove("d-none");
      setTimeout(() => {
        card.classList.remove("card-edit-cancel");
      }, 500);
      setTimeout(() => {
        addClass(spanEditCancel, "d-none");
        btnEditTable.removeAttribute("disabled");
      }, 2000);
    }
  } else {
    alertBadLink();
  }
}

function alertBadLink() {
  alertBadLinkTable.classList.remove("d-none");
  addClass(linkTable, "input-link-bad");
  setTimeout(() => {
    addClass(alertBadLinkTable, "d-none");
  }, 2000);
  setTimeout(() => {
    linkTable.classList.remove("input-link-bad");
  }, 500);
}

function validLink(link) {
  let validLink = link;
  validLink = validLink.toLowerCase();
  const siteName = "sima-land.ru";
  const normalStartLink = "https://www.sima-land.ru";

  if (validLink.includes(siteName)) {
    const countRemoveSymbl = validLink.indexOf(siteName) + siteName.length;
    const validLinkArr = validLink.split("");
    validLinkArr.splice(0, countRemoveSymbl, normalStartLink);
    validLink = validLinkArr.join("");
    return validLink;
  } else {
    return false;
  }
}

function setProcent(all, current) {
  current++;
  let procent = Math.floor(current / (all / 100));

  progressBar.style = `width: ${procent}%;`;
  progressBar.setAttribute("aria-valuenow", procent);
  if (procent > 4) {
    progressBar.innerHTML = `${procent}%`;
  }
}

function activeEditTable() {
  canEditTable = true;

  btnEditTable.setAttribute("disabled", "disabled");
  reWriteChecked.setAttribute("disabled", "disabled");
  linkTable.setAttribute("disabled", "disabled");
  progressDiv.classList.remove("d-none");
  btnCancelEditTable.classList.remove("d-none");
}

function setEditOff() {
  btnCancelEditTable.setAttribute("disabled", "disabled");
  canEditTable = false;
}

function cancelEditTable() {
  reWriteChecked.removeAttribute("disabled");
  linkTable.removeAttribute("disabled");
  addClass(progressDiv, "d-none");
  addClass(btnCancelEditTable, "d-none");
  btnCancelEditTable.removeAttribute("disabled");
  progressBar.innerHTML = "";
  progressBar.style = `width: 0%;`;
  progressBar.setAttribute("aria-valuenow", 0);
}

const liftFiles = new Map();

function crateFilesView(name, id) {
  return `<div class="list__selected-file" id=div${id}>
  ${name} <svg  id=${id} onclick=deleteFile(${id}) xmlns="http://www.w3.org/2000/svg" class="delete" viewBox="0 0 56 64"><defs><style>.cls-1{fill:#ff8989;}.cls-2{fill:#ff5d5d;}</style></defs><title>Trash Can</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M42.48,64h-29a6,6,0,0,1-6-5.5L4,16H52L48.46,58.5A6,6,0,0,1,42.48,64Z"/><path class="cls-2" d="M52,8H38V6a6,6,0,0,0-6-6H24a6,6,0,0,0-6,6V8H4a4,4,0,0,0-4,4v4H56V12A4,4,0,0,0,52,8ZM22,6a2,2,0,0,1,2-2h8a2,2,0,0,1,2,2V8H22Z"/><path class="cls-2" d="M28,58a2,2,0,0,1-2-2V24a2,2,0,0,1,4,0V56A2,2,0,0,1,28,58Z"/><path class="cls-2" d="M38,58h-.13A2,2,0,0,1,36,55.88l2-32a2,2,0,1,1,4,.25l-2,32A2,2,0,0,1,38,58Z"/><path class="cls-2" d="M18,58a2,2,0,0,1-2-1.87l-2-32a2,2,0,0,1,4-.25l2,32A2,2,0,0,1,18.13,58Z"/></g></g></svg>
</div>`;
}

function deleteFile(id) {
  liftFiles.delete(id);
  var item = document.getElementById("div" + id);
  item.parentNode.remove();
}

function closeModal() {
  const modal2 = document.getElementById("modal2");
  const modal = document.getElementById("modal");
  modal.style = "display:none";
  modal2.style = "display:none";
  countFilesBoxSelected.innerHTML = `Выбрано файлов: ${liftFiles.size}`;
}

async function addFile() {
  var input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => {
    var file = e.target.files[0];
    let div = document.createElement("DIV");
    let fileName =
      file.name.length > 25
        ? String(file.name).slice(0, 25) + "..."
        : file.name;
    div.innerHTML = crateFilesView(fileName, ++lastId);
    list.append(div);
    liftFiles.set(lastId, file.path);
  };
  input.click();
}
function openModal() {
  const modal2 = document.getElementById("modal2");
  modal2.className = "modal_shadow";
  const modal = document.getElementById("modal");
  modal.className = "modal";
  modal.style = "display:block";
  modal2.style = "display:block";
}

async function parceDocumentExcel() {
  const result = await cv2json({
    sourceFile: "одинаковые коробки.xls",
  });

  const list = await getExlObject(result);
  const list2 = await getExlObject(result);
  let a = getBox(3401964, list);
  concat([list, list2]); // готовый список из всех файлов дальше в getBox(3401964, list) вторым параметром передаешь его
}

function concat(lists) {
  let list = new Map();
  const obj = lists.map((item) => {
    const keys = item.keys();
    Array.from(keys).forEach((key) => {
      if (!list.has(key)) list.set(key, item.get(key));
      else {
        list.get(key).push(...item.get(key));
        let get = lodash.unionBy(list.get(key), "art");
        list.set(key, get);
      }
    });
    return list;
  });
  return list;
}

function getBox(art, list) {
  const keys = list.keys();
  const result = Array.from(keys).map((box) => {
    const value = list.get(box);

    const res = value.map((item) => {
      item.box = box;
      item.check = item.art == art;
      if (item.art == art) return item;
      return [];
    });
    const filtert = res.filter((item) => item.check);

    return filtert;
  });
  const filtert = result.filter((item) => item.length);

  return filtert.map((item) => {
    const a = { ...item };
    return a["0"];
  });
}

async function getExlObject(data) {
  const mass = [];
  const list = new Map();
  let number = 0;
  let checknumber = "";
  const r = /\d+/g;

  let m;
  const datas = await data;
  const arr = datas.TDSheet;
  for (let i = 0; i < arr.length; i++) {
    let checkBox = arr[i].B && arr[i].B.indexOf("Коробка №") === 0;
    if (checkBox) {
      checknumber = "";
      while ((m = r.exec(arr[i].B)) != null) {
        checknumber += m[0];
      }
      number = Number(checknumber.length && checknumber.slice(1));
      list.set(number, []);
    }

    if (Number(arr[i].A)) {
      let obj = {
        index: arr[i].A,
        art: arr[i].B,
        name: arr[i].G,
        count: arr[i].K,
        type: arr[i].L,
      };

      list.get(number).push(obj);
    }
  }
  return list;
}



function getSummAndBoxEntries(list) {
  return list.reduce(
    (acc, item) => {
      acc.count += Number(item.count);
      acc.boxName.push({ box: item.box, count: item.count });
      return acc;
    },
    { count: 0, boxName: [] }
  );
}

const checkBox = (curentBoxes, newBoxes, curentCount, newCount) => {
  let box = curentBoxes.join(',');
  let newBox = newBoxes.reduce((acc, i)=>{
   
        if(!curentBoxes.find(item=>{
          return item==i.box})){
          acc.count+=Number(i.count);
          acc.boxName+=`,${i.box}`
        }
        return acc;
      },{count :0, boxName:''})
      box+=newBox.boxName;
      curentCount+=newBox.count;
      return {box, count:curentCount}

};

async function setNumberBoxInTable() {
  if (liftFiles.size > 0) {
    const massFiles = [];
    const files = liftFiles.keys();
    for (var key of liftFiles.keys()) {
      const file = await cv2json({
        sourceFile: liftFiles.get(key),
      });
      const list = await getExlObject(file);
      massFiles.push(list);
    }
    const fileses = concat([...massFiles]);
    addClass(alertBadLinkTable, "d-none");
    const arrsLinks = await getTableRows(linkTable.value, "D1:N3000");

    const rezult = arrsLinks.map((item) => {
      if (item.length < 10) {
        if (!isNaN(item[0])) {
          const boxes = getBox(item[0], fileses);
          
          const value = getSummAndBoxEntries(boxes);
          if (boxes.length) {
            item.push(value.boxName.map(i=>i.box).join(','));
            item.push(value.count);
          }
          return item;
        }
        return item;
      } else {
        if (!isNaN(item[0])) {
          const boxes = getBox(item[0], fileses);
          const value = getSummAndBoxEntries(boxes);

           if (value.boxName.length) {
             let box = String(item[9]).split(',');
             let count = Number(item[10]) || 0;
            const result = checkBox(box.length?box:box,value.boxName,count,value.count)

            item[9] = result.box;
            item[10] =  result.count;
            }
          return item;
        }
        return item;
      }
      return item;
    });

    if (rezult[0].length < 10) {
      rezult[0].push("Номер коробок");
      rezult[0].push("количество штук");
    }

    updateTable(linkTable.value, "D1:N3000", rezult);
  }
}
