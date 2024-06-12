const teachersEL = document.querySelector('.teachers')
const teacherForm = document.querySelector('#teacher-form')
const submitModal = document.querySelector('#my_modal_2')
const addBtn = document.querySelector('#add-btn')
const showModalBtn = document.querySelector('#show-modal-btn')
const closeBtn = document.querySelector('#close-btn')
const teacherSearchInput = document.querySelector('#teacher-search-input')

let selected = null;
let search = "";

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
              <a href="student.html" class="btn btn-sm btn-primary">Students</a>
            </div>
          </div>
        </div>
    `
}

async function getTeachers() {
  try {
    teachersEL.innerHTML = '<span class="loading loading-spinner loading-lg fixed top-[45%]"></span>'
    const params = { name: search }
    let { data } = await axios.get('https://6663008762966e20ef0aece5.mockapi.io/Teacher', { params })
    teachersEL.innerHTML = ""
    data.map((teacher) => {
      teachersEL.innerHTML += getTeacherCard(teacher)
    })
  } catch (err) {
    console.log(err.response.data)
  } finally {
    // console.log('Work')
  }
}

getTeachers()


teacherForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const firstName = e.target.elements.firstName.value
  const lastName = e.target.elements.lastName.value
  const avatar = e.target.elements.image.value
  const groups = e.target.elements.groups.value
  const isMarried = e.target.elements.isMarried.value === 'Married' ? true : false
  const phoneNumber = e.target.elements.phoneNumber.value
  const email = e.target.elements.email.value
  const teacher = {
    firstName, lastName, avatar, groups, isMarried, phoneNumber, email
  }

  if (selected === null) {
    await axios.post(`https://6663008762966e20ef0aece5.mockapi.io/Teacher`, teacher)
  } else {
    await axios.put(`https://6663008762966e20ef0aece5.mockapi.io/Teacher/${selected}`, teacher)
  }

  getTeachers()

  // submitModal.classList.add("hide-visibility");
  teacherForm.reset()
  // location.reload();
})


async function editTeacher(id) {
  my_modal_2.showModal()
  let { data } = await axios.get(`https://6663008762966e20ef0aece5.mockapi.io/Teacher/${id}`)
  teacherForm.elements.firstName.value = data.firstName
  teacherForm.elements.lastName.value = data.lastName
  teacherForm.elements.image.value = data.avatar
  teacherForm.elements.groups.value = data.groups
  // teacherForm.elements.isMarried.value = data.isMarried
  teacherForm.elements.phoneNumber.value = data.phoneNumber
  teacherForm.elements.email.value = data.email
  // console.log(typeof Number(data.phoneNumber))
  selected = id;

  addBtn.textContent = 'Save'
}

showModalBtn.addEventListener('click', () => {
  selected = null;
  teacherForm.reset()
  addBtn.textContent = 'Add'
})

async function deleteTeacher(id) {
  let isDeleted = confirm('Are you sure you want to delete this teacher ?')
  if (isDeleted) {
    await axios.delete(`https://6663008762966e20ef0aece5.mockapi.io/Teacher/${id}`)
  }
  getTeachers()
}

closeBtn.addEventListener('click', () => {
  submitModal.classList.add("hide-visibility");
  // location.reload();
})


teacherSearchInput.addEventListener('keyup', (e) => {
  search = e.target.value;
  getTeachers()
})