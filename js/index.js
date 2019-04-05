let editableTaskId = null, editableTaskStatus = null

const tableBody = document.getElementById('table-body')


const renderTable = () => {
  tableBody.innerHTML = ''

  JSON.parse(localStorage.getItem('list')).map(function (value, key) {
    let
      tr = document.createElement('tr')
      td = document.createElement('td'),
      statusWork = value.status === 'work' ? 'selected' : '',
      statusExpected = value.status === 'expected' ? 'selected' : '',
      statusCompleted = value.status === 'completed' ? 'selected' : ''

      td.innerHTML = value.edit ? `
        <p>(Отредактировано)</p>
      ` : ``

      tr.innerHTML = `
        <td class="tcell">
          <button id="task-edit-btn-${key}" onclick="editTask(${key})" class="btn">Редактировать</button>
        </td>
        <td class="tcell">${value.name}</td>
        <td class="tcell">${value.date}</td>
        <td class="tcell">${value.task}</td>
        <td class="tcell">
          <select id="task-status-${key}" onchange="editTask(${key}), addTask()">
            <option ${statusExpected} value="expected">Ожидается</option>
            <option ${statusWork} value="work">В работе</option>
            <option ${statusCompleted} value="completed">Выполнено</option>
          </select>
        </td>
      `
      tr.appendChild(td)
      tableBody.appendChild(tr)

      if (value.status === 'completed') {
        document.getElementById(`task-edit-btn-${key}`).disabled = true
        document.getElementById(`task-status-${key}`).disabled = true
      }
  })
}

const getformData = () => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list')),
    name = document.getElementById('name').value,
    date = document.getElementById('date').value,
    task = document.getElementById('task').value,
    status = 'expected',
    edit = false  

  return [{ name, date, task, status, edit }]
}

const editTask = (id) => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list')),
    status = document.getElementById(`task-status-${id}`).value

    document.getElementById('name').value = currentStorage[id].name
    document.getElementById('date').value = currentStorage[id].date
    document.getElementById('task').value = currentStorage[id].task

    editableTaskStatus = status
    editableTaskId = id
}

const addTask = async () => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list')),
    currentFormData = await getformData()

  if (Number.isInteger(editableTaskId)) {
    currentStorage.splice(editableTaskId, 1)
    currentFormData[0].edit = true
    currentFormData[0].status = editableTaskStatus 
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

const sortByName = () => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list'))

    currentStorage.sort((a, b) => {
      if(a.name < b.name) return -1
      if(a.name > b.name) return 1
    })

    window.localStorage.setItem('list', JSON.stringify([...currentStorage]))

    renderTable()
}

const sortByNameReverse = () => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list'))

    currentStorage.sort((a, b) => {
      if(a.name < b.name) return 1
      if(a.name > b.name) return -1
    })

    window.localStorage.setItem('list', JSON.stringify([...currentStorage]))

    renderTable()
}

const sortByDate = () => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list'))

    currentStorage.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })

    window.localStorage.setItem('list', JSON.stringify([...currentStorage]))

    renderTable()
}

const sortByDateReverse = () => {
  let
    currentStorage = JSON.parse(window.localStorage.getItem('list'))

    currentStorage.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })

    window.localStorage.setItem('list', JSON.stringify([...currentStorage]))

    renderTable()
}

renderTable()
