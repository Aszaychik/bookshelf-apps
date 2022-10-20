// Kriteria 1: Mampu Menambahkan Data Buku

// Bookshelf Apps harus mampu menambahkan data buku baru.
// Data buku yang disimpan merupakan objek JavaScript dengan struktur berikut:

// {
//   id: string | number,
//   title: string,
//   author: string,
//   year: number,
//   isComplete: boolean,
// }

// Kriteria 2: Memiliki Dua Rak Buku

// Bookshelf Apps harus memiliki 2 Rak buku. Yakni, “Belum selesai dibaca” dan “Selesai dibaca”.
// Rak buku "Belum selesai dibaca" hanya menyimpan buku jika properti isComplete bernilai false.
// Rak buku "Selesai dibaca" hanya menyimpan buku jika properti isComplete bernilai true.

// Kriteria 3: Dapat Memindahkan Buku antar Rak

// Buku yang ditampilkan pada rak, baik itu "Belum selesai dibaca" maupun "Selesai dibaca" harus dapat dipindahkan di antara keduanya.

// Kriteria 4: Dapat Menghapus Data Buku

// Buku yang ditampilkan pada rak, baik itu "Belum selesai dibaca" maupun "Selesai dibaca" harus dapat dihapus.

// Kriteria 5: Manfaatkan localStorage dalam Menyimpan Data Buku

// Data buku yang ditampilkan pada rak, baik itu "Belum selesai dibaca" maupun "Selesai dibaca" harus dapat bertahan walaupun halaman web ditutup.
// Dengan begitu, Anda harus menyimpan data buku pada localStorage.
const bookShelf = []
const RENDER_EVENT = 'render-bookshelf';
const STORAGE_KEY = 'key-bookshelf'
const SAVED_EVENT = 'saved-bookshelf'


const generateId = () => {
  return +new Date();
}

const generateBookShelfObject = (id, title, author, year, isComplete) =>{
  return{
    id,
    title,
    author,
    year,
    isComplete,
  }
}

const findBook = (bookId) => {
  for(const bookItem of bookShelf){
    if(bookItem.id === bookId){
      return bookItem
    }
  }
  return null
}

const findBookIndex = (bookId) => {
  for(const index in bookShelf){
    if(bookShelf[index].id === bookId){
      return index;
    }
  }
  return -1
}

const isStorageExist = () =>{
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

const saveBook = ()=>{
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(bookShelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const loadDataFromStorage = ()=>{
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);
 
   if (data !== null) {
     for (const book of data) {
       bookShelf.push(book);
     }
   }
 
   document.dispatchEvent(new Event(RENDER_EVENT));
}



const createBookList = (bookShelfObject) =>{
  const{id,title,author,year,isComplete} = bookShelfObject

  const textTitle = document.createElement('h3')
  textTitle.innerText = title;
  
  const textAuthor = document.createElement('p')
  textAuthor.innerText = `Author : ${author}`;
  
  const textYear = document.createElement('p')
  textYear.innerText = `Year : ${year}`;
  
  const greenBtn = document.createElement('button')
  greenBtn.classList.add("green")
  
  const redBtn = document.createElement('button')
  redBtn.classList.add("red")
  redBtn.innerText = "Delete Book";


  
  const containerBtn = document.createElement('div')
  containerBtn.classList.add("action")
  containerBtn.append(greenBtn, redBtn)
  
  const article = document.createElement('article')
  article.classList.add("book_item")
  article.append(textTitle, textAuthor, textYear, containerBtn);

  if(isComplete){
    completeBookshelfList.append(article)
    greenBtn.innerText = "Incomplete Reading"
    greenBtn.addEventListener('click', ()=>{
      toIncomplete(id)
    })
  }else if(!isComplete){
    incompleteBookshelfList.append(article)
    greenBtn.innerText = "Completed Reading"
    greenBtn.addEventListener('click', ()=>{
      toComplete(id)
    })
  }

  redBtn.addEventListener("click", ()=>{
    deleteBook(id)
  })
}

const addBookShelf = () =>{
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId()
  const bookShelfObject = generateBookShelfObject(generateID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
  bookShelf.push(bookShelfObject)

  document.dispatchEvent(new Event(RENDER_EVENT));

  console.log('bookShelfObject', bookShelfObject)
  saveBook()
}

const toIncomplete = (id) =>{
  const bookTarget = findBook(id)
  if(bookTarget == null)return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveBook()
}

const toComplete = (id) =>{
  const bookTarget = findBook(id)
  if(bookTarget == null)return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveBook()
}

const deleteBook = (id) =>{
  const bookTarget = findBookIndex(id)
  if(bookTarget === -1) return
  bookShelf.splice(bookTarget, 1)

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveBook()
}


document.addEventListener('DOMContentLoaded', function () {
  const inputBook /* HTMLFormElement */ = document.getElementById('inputBook');

  inputBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBookShelf();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function (){
  const completeBookshelfList = document.getElementById("completeBookshelfList")
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList")
  
  completeBookshelfList.innerHTML = '';
  incompleteBookshelfList.innerHTML = '';

  for(const bookItem of bookShelf){
    const bookElement = createBookList(bookItem)
    if(bookItem.isComplete){
      completeBookshelfList.append(bookElement);
    } else{
      incompleteBookshelfList.append(bookElement)
    }
  }
})