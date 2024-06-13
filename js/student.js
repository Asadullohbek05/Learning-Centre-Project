const params = new URLSearchParams(location.search)
const teacherId = params.get('TeacherId')

const studentsEl = document.querySelector('.students')
const studentsQuantity = document.querySelector('.students-quantity')
const studentsSearchInput = document.querySelector('#students-search-input')
const teachersSelect = document.querySelector('#teachers-select')

let search = params.get('search') || "";
let teacher = teacherId

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
    studentsEl.innerHTML = '<span class="loading loading-spinner loading-lg fixed top-[45%]"></span>'
    const params = { firstName: search }
    let { data } = await request.get(`Teacher/${teacherId}/Student`, { params })
    studentsQuantity.textContent = data.length
    studentsEl.innerHTML = ""
    data.map(student => {
      studentsEl.innerHTML += getStudentCard(student)
    })
  } catch (err) {
    console.log(err)
    studentsEl.innerHTML = `<h3 class="text-3xl pt-10 text-[red]">Student Not Found</h3>`
    studentsQuantity.textContent = 0;
  }
}

getStudents()

// Search Students

//  Search Teacher
studentsSearchInput.addEventListener('keyup', (e) => {
  search = e.target.value;
  params.set('search', search)
  history.pushState({}, {}, location.pathname + "?" + params.toString())


  getStudents()
})


teachersSelect.addEventListener('change', (e) => {
  teacher = e.target.value
})