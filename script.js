const message = 'Table'

document.querySelector('#header').innerHTML = message

function loadData(url, onSuccess, onError) {
  const Http = new XMLHttpRequest()
  Http.open('GET', url, true)

  Http.onload = function () {
    if (Http.status === 200) {
      const data = JSON.parse(Http.responseText)
      onSuccess(data)
    } else {
      onError(Http.statusText)
    }
  };

  Http.onerror = function () {
    onError('Network error')
  }

  Http.send()
}

function loadTable(data) {
  const tableBody = document.querySelector('tbody')
  tableBody.innerHTML = ''

  data.forEach((row) => {
    const tr = document.createElement('tr')
    tableBody.appendChild(tr)

    Object.values(row).forEach((value) => {
      const td = document.createElement('td')
      td.textContent = value
      tr.appendChild(td)
    })
  })

  let table = document.getElementById('table')

  table.onclick = function (e) {
    if (e.target.tagName != 'TH') return
    let th = e.target
    let sortDirection =
      header.getAttribute("data-sort-direction") === "asc" ? "desc" : "asc"
    header.setAttribute("data-sort-direction", sortDirection)

    sortTable(th.cellIndex, th.dataset.type, table, sortDirection)
  }
}

function showError(message) {
  const error = document.createElement('div')
  error.className = 'error'
  error.textContent = message
  document.body.insertBefore(error, document.body.firstChild)
}

function sortTable(colNum, type, table, direction) {
  let tbody = table.querySelector('tbody')
  let rowsArray = Array.from(tbody.rows)
  let compare;

  switch(type) {
    case 'number':
      compare = function(rowA, rowB) {
        let result;

        if (direction == 'asc') {
          result = rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML
        } else {
          result = rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML
        }

        return result
      }
      break;

    case 'string':
      compare = function (rowA, rowB) {
        let result;

        if (direction == 'asc') {
           result = rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML
        } else {
           result = rowA.cells[colNum].innerHTML < rowB.cells[colNum].innerHTML
        }

        return result ? 1 : -1
      }
      break;
  }

  rowsArray.sort(compare)

  tbody.append(...rowsArray)
}

function tableSearch() {
  let phrase = document.getElementById('input').value
  let table = document.getElementById('table')

  let regPhrase = new RegExp(phrase.substring(0, phrase.length - 1), 'i')
    let flag = false
    for (let i = 1; i < table.rows.length; i++) {
      flag = false
      for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
        flag = regPhrase.test(table.rows[i].cells[j].innerHTML)
        if (flag) break
      }
      if (flag) {
        table.rows[i].style.display = ""
      } else {
        table.rows[i].style.display = "none"
      }
    }
}

loadData('https://jsonplaceholder.typicode.com/posts', loadTable, showError);
