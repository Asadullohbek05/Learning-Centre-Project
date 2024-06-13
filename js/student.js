const params = new URLSearchParams(location.search)
const teacherId = params.get('TeacherId')

const studentsEl = document.querySelector('.students')
const studentsQuantity = document.querySelector('.students-quantity')
const studentsSearchInput = document.querySelector('#students-search-input')
const teachersSelect = document.querySelector('#teachers-select')
const teacherName = document.querySelector('.teacher-name')
const StudentsPagination = document.querySelector('.students-pagination')


let search = params.get('search') || "";
let teacher = teacherId

let activePage = +params.get('activePage') || 1;
let studentLenght = 0;

studentsSearchInput.value = search


function getStudentCard({ id, firstName, lastName, birthday, isWork, image, phoneNumber, email }) {
  return `
          <div class="card border w-72 bg-base-100 shadow-md mb-3 transition-all cursor-pointer hover:shadow-2xl">
            <figure>
              <img  src="${image}" alt=${firstName} class="w-[80%] h-[170px] rounded-3xl mt-5 object-cover" />
            </figure>
            <div class="px-5 py-4">
              <h2 class="text-[15px] mb-2">
                Fullname:
                <span class="font-semibold">${firstName} ${lastName}</span>
              </h2>
              <h3 class="text-[15px] mb-2">
                Birthday
                <span class="bg-slate-500 text-white px-2 rounded font-semibold">${birthday.slice(0, 10)}</span>
              </h3>
              <h3 class="text-[15px] mb-2">
                Number:
                <span class="bg-yellow-300 px-2 text-[15px] font-semibold rounded"
                  >${phoneNumber}</span
                >
              </h3>
              <h3 class="text-[15px] mb-3">
                Email : <span class="font-semibold">${email.slice(0, 20)}...</span>
              </h3>
              <div class="flex justify-between">
                <button  class="btn btn-sm btn-secondary w-full">Add to Favorites</button>
              </div>
            </div>
          </div>
      `
}


async function getStudents() {
  try {
    setQuery()
    const { data: { firstName } } = await request.get(`Teacher/${teacher}`)
    teacherName.textContent = firstName + `'s `

    studentsEl.innerHTML = '<span class="loading loading-spinner loading-lg fixed top-[45%]"></span>'
    const params = { firstName: search, page: activePage, limit: LIMIT }
    let { data } = await request.get(`Teacher/${teacher}/Student`, { params: { firstName: search } })

    let { data: pageStudents } = await request.get(`Teacher/${teacher}/Student`, { params })
    studentLenght = data.length
    studentsQuantity.textContent = studentLenght
    studentsEl.innerHTML = ""

    getPagination()

    pageStudents.map(student => {
      studentsEl.innerHTML += getStudentCard(student)
    })
  } catch (err) {
    console.log(err)
    studentsEl.innerHTML = `<h3 class="text-3xl pt-10 text-[red]">Student Not Found</h3>`
    studentsQuantity.textContent = 0;
    StudentsPagination.innerHTML = ""
  }
}

getStudents()

function getPagination() {
  if (studentLenght <= LIMIT) {
    StudentsPagination.innerHTML = ""
  } else {
    StudentsPagination.innerHTML = `<button onClick="getPage('-')" class="join-item btn btn-outline-primary ${activePage === 1 ? 'btn-disabled' : ''}">Previous page</button>`
    let pages = Math.ceil(studentLenght / LIMIT)
    for (let i = 1; i <= pages; i++) {
      StudentsPagination.innerHTML += `<button class="join-item btn ${i === activePage ? 'btn-primary' : ''}" onClick="getPage(${i})" >${i}</button>`
    }
    StudentsPagination.innerHTML += `<button onClick="getPage('+')" class="join-item btn btn-outline-primary ${activePage === pages ? 'btn-disabled' : ''}">Next page</button > `
  }
}

function getPage(i) {
  if (i === '-') {
    activePage--
  } else if (i === '+') {
    activePage++
  } else {
    activePage = i
  }
  getStudents()
}

async function getTeachersCategory() {
  try {
    let { data } = await request.get('Teacher')
    data.map(({ id, firstName, lastName }) => {
      teachersSelect.innerHTML += `<option ${id === teacher ? 'selected' : ''} value=${id}>${firstName} ${lastName}</option>`
    })
  } catch (err) {
    console.log(err)
  }
}

getTeachersCategory()


// Search Students
studentsSearchInput.addEventListener('keyup', (e) => {
  search = e.target.value;
  activePage = 1
  getStudents()
})


teachersSelect.addEventListener('change', (e) => {
  teacher = e.target.value
  activePage = 1
  getStudents()
})

function setQuery() {
  params.set('search', search)
  params.set('teacherId', teacher)
  params.set('activePage', activePage)

  history.pushState({}, {}, location.pathname + "?" + params.toString())
}