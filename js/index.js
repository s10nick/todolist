let editableTaskId = null

const tableBody = document.getElementById('table-body')


const renderTable = () => {
  tableBody.innerHTML = ''

  JSON.parse(localStorage.getItem('list')).map(function (value, key) {
    let
      tr = document.createElement('tr')
      td = document.createElement('td')

      td.innerHTML = value.edit ? `
        <p>(Отредактировано)</p>
      ` : ``

      tr.innerHTML = `
        <td class="tcell">
          <button onclick="editTask(${key})" class="btn">Редактировать</button>
        </td>
        <td class="tcell">${value.name}</td>
        <td class="tcell">${value.date}</td>
        <td class="tcell">${value.task}</td>
        <td class="tcell">
          <select>
            <option value="expected">Ожидается</option>
            <option value="work">В работе</option>
            <option value="completed">Выполнено</option>
          </select>
        </td>
      `
      tr.appendChild(td)
      tableBody.appendChild(tr)
  })
}

const getformData = () => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list')),
    name = document.getElementById('name').value,
    date = document.getElementById('date').value,
    task = document.getElementById('task').value,
    status = editableTaskId ? currentStorage[editableTaskId].status : 'expected',
    edit = false  

  return [{ name, date, task, status, edit }]
}

const editTask = (id) => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list'))

    document.getElementById('name').value = currentStorage[id].name
    document.getElementById('date').value = currentStorage[id].date
    document.getElementById('task').value = currentStorage[id].task

    editableTaskId = id
}

const addTask = async () => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list')),
    currentFormData = await getformData()

  if (Number.isInteger(editableTaskId)) {
    currentStorage.splice(editableTaskId, 1)
    currentFormData[0].edit = true 
  }

  editableTaskId = null
  
  if (currentStorage) {

    await window.localStorage.setItem('list', JSON.stringify([...currentFormData, ...currentStorage]))
    
    renderTable()
    refreshForm()

  } else {

    await window.localStorage.setItem('list', JSON.stringify([...currentFormData]))

    renderTable()
    refreshForm()
  }
  
}

const refreshForm = () => {
  document.getElementById('name').value = ''
  document.getElementById('date').value = null
  document.getElementById('task').value = '' 
}

renderTable()
