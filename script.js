const createFolder = require(__dirname+'/index').createFolder
const createToken = require(__dirname+'/index').createToken
const checkConnect = require(__dirname+'/index').checkConnect
const shell = require('electron').shell
const createExcel = require(__dirname+'/index').createExcel
const delToken = require(__dirname+'/index').delToken
const getTableRows = require(__dirname+'/index').getTableRows
const parseURL = require(__dirname + '/parser').parseURL
const updateTable = require(__dirname + '/index').updateTable

const checkNumBox = document.querySelector("#addNumberBox"); //
const selectorNumBox = document.querySelector(".selector-number-box"); //
const viewsAuthBtn = document.querySelector(".log"); //
const formAuth = document.querySelector(".form-auth"); //
const authInput = document.querySelector(".input-auth")
const btnLogIn = document.querySelector(".btn-log-in")
const btnLogOut = document.querySelector(".btn-log-out")
const messageAuthTrue = document.querySelector(".auth-true-mes")
const messageAuthFalse = document.querySelector(".auth-false-mes")
const alertNotAuth = document.querySelector(".alert-not-auth")
const card = document.querySelector(".card")
const linkTable = document.querySelector("#linkTable")
const progressBar = document.querySelector(".progress-bar")
const progressDiv = document.querySelector(".progress")
const reWriteChecked = document.querySelector("#re-write-checked")
const btnEditTable = document.querySelector(".btn-edit-table")
const selectedFileWithBox = document.querySelector("#selected-file-with-box")
const btnCancelEditTable = document.querySelector('.btn-cancel-edit-table')
const spanEditCompleted = document.querySelector('.span-edit-completed')
const spanEditCancel = document.querySelector('.span-edit-cancel')
const selectActions = document.querySelector('#select-actions')
const actionDiv = document.querySelectorAll('.action-div')
const alertBadLinkTable = document.querySelector('.bad-link')

let canEditTable = false

if (card) {
    (async function() {
        await checkAuth()
    }())
}

async function logIn(){
  getTocken()
  btnLogIn.setAttribute('disabled', true)
  setTimeout(async () => {
    const status = await checkAuth()

    if (status) {
      addClass(formAuth, 'd-none')
      authInput.value = ''
      authInput.setAttribute('readonly', true)
    }
    btnLogIn.removeAttribute('disabled')
  }, 3000)
}

async function logOut() {
    await delToken()
    await checkAuth()
}

function addClass(el, addClass) {
    if (!el.classList.contains(addClass)) {
        el.classList.add(addClass)
    }
}

async function checkAuth() {
    let auth = await checkConnect()
  if (auth) {
      addClass(viewsAuthBtn, 'd-none')
      addClass(alertNotAuth, 'd-none')

    messageAuthTrue.classList.remove('d-none')
    btnLogOut.classList.remove('d-none')
    card.classList.remove('d-none')
    
  } else {

    addClass(messageAuthTrue, 'd-none')
    addClass(btnLogOut, 'd-none')
    addClass(card, 'd-none')

    alertNotAuth.classList.remove('d-none')
    viewsAuthBtn.classList.remove('d-none')
    messageAuthFalse.classList.remove('d-none')
    btnLogIn.setAttribute('disabled', true)
    setTimeout(() => {
        addClass(messageAuthFalse, 'd-none')
        btnLogIn.removeAttribute('disabled')
    }, 1000)
  }

  return auth
}

function checkBoxChecked() {

  if (checkNumBox.checked) {
    checkNumBox.removeAttribute('checked')
    selectorNumBox.classList.remove("d-none");
  } else {
    checkNumBox.setAttribute('checked', true)
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
  authInput.removeAttribute('readonly')
}

function hideAndShow(hidenArr = [], showArr = []) {
  if (hidenArr.length !== 0) {
    hidenArr.forEach(el => {
      if(!el.classList.contains("d-none")) {
        el.classList.add("d-none")
      }
    })
  }
  if (showArr.length !== 0) {
    showArr.forEach(el => {
      el.classList.remove("d-none")
    })
  }
}


function changeActionOnTable() {
  const selectedAction = selectActions.selectedIndex
  const hidenArr = []
  const showArr = []
  if (selectedAction === "0") {
    actionDiv.forEach((item) => {
      hidenArr.push(item)
    })
  } else {
    actionDiv.forEach((item, index) => {
      if (selectedAction === index + 1) {
        showArr.push(item)
      } else {
        hidenArr.push(item)
      }
    })  
  }

  hideAndShow(hidenArr, showArr)
}

let gen = createToken()

function addFolder(event){
 try {
     const fileName = document.getElementById('nameFolder').value;
    

    createFolder('exlRootState')
 }
 catch{

 }
}

function aut(){
    gen = createToken()
    
   const link = gen.next()
   shell.openExternal(link.value)

   activeInput()
   
}

async function getTocken(){
  
  const token =  authInput.value
  gen.next(token)

}

async function newExcel(){
    const a = await checkConnect()
    if(a) {
        createExcel()
    } else {

    }
}

async function getLinks() {
  addClass(alertBadLinkTable, 'd-none')
  const arrsLinks = await getTableRows(linkTable.value, "C2:E3000")

  if (!(arrsLinks === null)){

    activeEditTable()
    const reWrite = reWriteChecked.checked
    let dataParse = {}
    const arrsLinkArtName = []

    for (let i = 0; i < arrsLinks.length; i++) {
      if (canEditTable) {
        setProcent(arrsLinks.length, i)

        if (arrsLinks[i].length !== 0){
        
          if (arrsLinks[i][0] !== '') {
            let link = validLink(arrsLinks[i][0])
  
            if (link && link.includes("sima-land.ru")){
              if (reWrite) {
                dataParse = await parseURL(link, i+2)
                await new Promise((resolve, reject) => setTimeout(resolve, 50))
                arrsLinkArtName.push([arrsLinks[i][0], dataParse.article, dataParse.title])
              } else {
                if (arrsLinks[i].length === 1) {
                  dataParse = await parseURL(link, i+2)
                  await new Promise((resolve, reject) => setTimeout(resolve, 50))
                  arrsLinkArtName.push([arrsLinks[i][0], dataParse.article, dataParse.title])
                } else {
                  if (arrsLinks[i].length === 2) {
                    dataParse = await parseURL(link, i+2)
                    await new Promise((resolve, reject) => setTimeout(resolve, 50))
                    arrsLinkArtName.push([arrsLinks[i][0], arrsLinks[i][1], dataParse.title])
                  } else {
                    if (arrsLinks[i].length === 3 && arrsLinks[i][1] === '') {
                      dataParse = await parseURL(link, i+2)
                      await new Promise((resolve, reject) => setTimeout(resolve, 50))
                      arrsLinkArtName.push([arrsLinks[i][0], dataParse.article, arrsLinks[i][2]])
                    } else {
                      if (arrsLinks[i].length === 3) {
                        arrsLinkArtName.push([arrsLinks[i][0], arrsLinks[i][1], arrsLinks[i][2]])
                      }
                    }
                  }
                }
              }
            } else {
              if (arrsLinks[i].length === 1) {
                arrsLinkArtName.push([arrsLinks[i][0], '', ''])
              } else {
                if (arrsLinks[i].length === 2) {
                  arrsLinkArtName.push([arrsLinks[i][0], arrsLinks[i][1], ''])
                } else {
                  arrsLinkArtName.push([arrsLinks[i][0], arrsLinks[i][1], arrsLinks[i][2]])
                }
              }
            }
  
          } else {
            if (arrsLinks[i].length === 2) {
              arrsLinkArtName.push([arrsLinks[i][0], arrsLinks[i][1], ''])
            } else {
              arrsLinkArtName.push([arrsLinks[i][0], arrsLinks[i][1], arrsLinks[i][2]])
            }
          }
  
        } else {
          arrsLinkArtName.push(['', '', ''])
        }
      } else {
        cancelEditTable()
        addClass(card, '.card-edit-cancel')
        spanEditCancel.classList.remove('d-none')
        setTimeout(() => {
          card.classList.remove('.card-edit-cancel')
        }, 500)
        setTimeout(() => {
          addClass(spanEditCancel, 'd-none')
          btnEditTable.removeAttribute('disabled')
        }, 2000)
        break
      }
    }
    
    btnCancelEditTable.setAttribute('disabled', 'disabled')
    if (canEditTable) {
      const num = arrsLinkArtName.length + 1
      const updated = await updateTable(linkTable.value, `C2:E${num}`, arrsLinkArtName)
      cancelEditTable()

      if (updated) {
        addClass(card, 'card-edit-completed')
        spanEditCompleted.classList.remove('d-none')
        setTimeout(() => {
          card.classList.remove('card-edit-completed')
        }, 500)
        setTimeout(() => {
          addClass(spanEditCompleted, 'd-none')
          btnEditTable.removeAttribute('disabled')
        }, 2000)
      } else {
        addClass(card, 'card-edit-cancel')
        spanEditCancel.classList.remove('d-none')
        setTimeout(() => {
          card.classList.remove('card-edit-cancel')
        }, 500)
        setTimeout(() => {
          addClass(spanEditCancel, 'd-none')
          btnEditTable.removeAttribute('disabled')
        }, 2000)
      }

    } else {
      cancelEditTable()
      addClass(card, 'card-edit-cancel')
      spanEditCancel.classList.remove('d-none')
      setTimeout(() => {
        card.classList.remove('card-edit-cancel')
      }, 500)
      setTimeout(() => {
        addClass(spanEditCancel, 'd-none')
        btnEditTable.removeAttribute('disabled')
      }, 2000)
    }
  } else {
    alertBadLink()
  }
}

function alertBadLink() {
  alertBadLinkTable.classList.remove('d-none')
  addClass(linkTable, 'input-link-bad')
  setTimeout(() => {
    addClass(alertBadLinkTable, 'd-none')
  }, 2000)
  setTimeout(() => {
    linkTable.classList.remove('input-link-bad')
  }, 500)
}

function validLink(link) {
  let validLink = link
  validLink = validLink.toLowerCase()
  const siteName = "sima-land.ru"
  const normalStartLink = "https://www.sima-land.ru"

  if (validLink.includes(siteName)) {
    const countRemoveSymbl = validLink.indexOf(siteName) + siteName.length
    const validLinkArr = validLink.split('')
    validLinkArr.splice(0, countRemoveSymbl, normalStartLink)
    validLink = validLinkArr.join('')
    return validLink
  } else {
      return false
  }
}

function setProcent(all, current) {
  current++
  let procent = Math.floor(current / (all / 100))

  progressBar.style = `width: ${procent}%;`
  progressBar.setAttribute('aria-valuenow', procent)
  if (procent > 4) {
    progressBar.innerHTML = `${procent}%`
  }
}

function activeEditTable() {
  canEditTable = true

  btnEditTable.setAttribute('disabled', 'disabled')
  selectedFileWithBox.setAttribute('disabled', 'disabled')
  reWriteChecked.setAttribute('disabled', 'disabled')
  linkTable.setAttribute('disabled', 'disabled')
  progressDiv.classList.remove('d-none')
  btnCancelEditTable.classList.remove('d-none')
}

function setEditOff() {
  btnCancelEditTable.setAttribute('disabled', 'disabled')
  canEditTable = false
}

function cancelEditTable() {

  selectedFileWithBox.removeAttribute('disabled')
  reWriteChecked.removeAttribute('disabled')
  linkTable.removeAttribute('disabled')
  addClass(progressDiv, 'd-none')
  addClass(btnCancelEditTable, 'd-none')
  btnCancelEditTable.removeAttribute('disabled')
  progressBar.innerHTML = ''
  progressBar.style = `width: 0%;`
  progressBar.setAttribute('aria-valuenow', 0)
}

// function viewAuth() {
//     if (formAuth.classList.contains('d-none')) {
//         formAuth.classList.remove('d-none')
//     } else {
//         formAuth.classList.add('d-none')
//     }
// }
