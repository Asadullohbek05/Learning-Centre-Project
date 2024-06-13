const params = new URLSearchParams(location.search)

const teachersEL = document.querySelector('.teachers')
const teacherForm = document.querySelector('#teacher-form')
const submitModal = document.querySelector('#my_modal_2')
const addBtn = document.querySelector('#add-btn')
const showModalBtn = document.querySelector('#show-modal-btn')
const closeBtn = document.querySelector('#close-btn')
const teacherSearchInput = document.querySelector('#teacher-search-input')
const teacherQuantity = document.querySelector('.teachers-quantity')
const teacherSortSelect = document.querySelector('#teacher-sort-select')
const teachersPagination = document.querySelector('.teachers-pagination')
const limitSelect = document.querySelector('.pagination-limit')

let selected = null;
let search = params.get('search') || "";
let teacherSort = params.get('teacherSort') || "";
let activePage = +params.get('activePage') || 1;
let teachersLenght = 0;
let limit = +params.get('limit') || LIMIT

teacherSearchInput.value = search

function getTeacherCard({ id, firstName, lastName, avatar, isMarried, phoneNumber, email }) {
  return `
        <div class="card border w-72 bg-base-100 shadow-md mb-3 pt-1 transition-all cursor-pointer hover:shadow-2xl">
          <figure>
            <img  src="${avatar}" alt=${firstName} class="w-[160px] h-[160px] object-cover rounded-full" />
          </figure>
          <div class="px-5 py-4">
            <h2 class="text-[15px] mb-2">
              Fullname:
              <span class="font-semibold">${firstName} ${lastName}</span>
            </h2>
            <h3 class="text-[15px] mb-2">
              IsMarried
              <span class="bg-slate-500 text-white px-2 rounded font-semibold">${isMarried ? 'Married' : 'Single'}</span>
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
              <button  onclick="editTeacher(${id})" class="btn btn-sm btn-success text-white">Edit</button>
              <button onclick="deleteTeacher(${id})" class="btn btn-sm btn-error text-white">Delete</button>
              <a href="students.html?TeacherId=${id}" class="btn btn-sm btn-primary">See Students</a>
            </div>
          </div>
        </div>
    `
}

// get Teachers
async function getTeachers() {
  try {
    setQuery()

    teachersEL.innerHTML = '<span class="loading loading-spinner loading-lg fixed top-[45%]"></span>'

    const [orderBy, order] = teacherSort.split('-')
    const params = { firstName: search, orderBy, order, page: activePage, limit }

    let { data } = await request.get('Teacher', { params: { firstName: search } })

    let { data: pageTeachers } = await request.get('Teacher', { params })
    teachersLenght = data.length;

    teacherQuantity.textContent = data.length
    teachersEL.innerHTML = ""

    getPagination()

    pageTeachers.map((teacher) => {
      teachersEL.innerHTML += getTeacherCard(teacher)
    })
  } catch (err) {
    console.log(err.response.data)
    teacherQuantity.textContent = 0
    teachersPagination.innerHTML = ""
    teachersEL.innerHTML = '<h3 class="text-3xl pt-10 text-[red]">Teacher Not Found</h3>'
  }
}

getTeachers()

function getPagination() {
  let pages = Math.ceil(teachersLenght / limit)
  if (teachersLenght <= limit) {
    teachersPagination.innerHTML = ""
  } else {
    teachersPagination.innerHTML = `<button onClick="getPage('-')" class="join-item btn btn-outline-primary ${activePage === 1 ? 'btn-disabled' : ''}">Previous page</button>`
    for (let i = 1; i <= pages; i++) {
      teachersPagination.innerHTML += `<button class="join-item btn ${i === activePage ? 'btn-primary' : ''}" onClick="getPage(${i})" >${i}</button>`
    }
    teachersPagination.innerHTML += `<button onClick="getPage('+')" class="join-item btn btn-outline-primary ${activePage === pages ? 'btn-disabled' : ''}">Next page</button > `
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
  getTeachers()
}

// Add Teacher
teacherForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const firstName = e.target.elements.firstName.value
  const lastName = e.target.elements.lastName.value
  const avatar = e.target.elements.image.value
  const isMarried = e.target.elements.isMarried.value === 'Married' ? true : false
  const phoneNumber = e.target.elements.phoneNumber.value
  const email = e.target.elements.email.value
  const teacher = {
    firstName, lastName, avatar, isMarried, phoneNumber, email
  }

  if (selected === null) {
    await request.post(`Teacher`, teacher)
  } else {
    await request.put(`Teacher / ${selected} `, teacher)
  }

  submitModal.close()

  getTeachers()

  teacherForm.reset()
})

// Edit Teacher
async function editTeacher(id) {
  my_modal_2.showModal()
  let { data } = await request.get(`Teacher / ${id} `)
  teacherForm.elements.firstName.value = data.firstName
  teacherForm.elements.lastName.value = data.lastName
  teacherForm.elements.image.value = data.avatar
  // teacherForm.elements.isMarried.value = data.isMarried
  teacherForm.elements.phoneNumber.value = data.phoneNumber
  teacherForm.elements.email.value = data.email
  selected = id;

  addBtn.textContent = 'Save'
}

showModalBtn.addEventListener('click', () => {
  selected = null;
  teacherForm.reset()
  addBtn.textContent = 'Add'
})

// Delete Teacher
async function deleteTeacher(id) {
  let isDeleted = confirm('Are you sure you want to delete this teacher ?')
  if (isDeleted) {
    await request.delete(`Teacher / ${id} `)
    getTeachers()
  }
}

// Close Modal
closeBtn.addEventListener('click', () => {
  submitModal.close()
})

//  Search Teacher
teacherSearchInput.addEventListener('keyup', (e) => {
  search = e.target.value;
  activePage = 1
  getTeachers()
})


teacherSortSelect.addEventListener('change', (e) => {
  teacherSort = e.target.value;
  getTeachers()
})

limitSelect.addEventListener('change', (e) => {
  activePage = 1
  limit = e.target.value
  getTeachers()
})

function setQuery() {
  params.set('search', search)
  params.set('teacherSort', teacherSort)
  params.set('activePage', activePage)
  params.set('limit', limit)

  history.pushState({}, {}, location.pathname + "?" + params.toString())
}