const login = () => {
  const nameInput = document.getElementById("nameInput").value
  const passInput = document.getElementById("passInput").value 
  

  if (!nameInput ) {
    Swal.fire({
      icon: "error",
      title: "The name is incorrect!",
    });
  }
  else if (passInput !== '123456') {
     Swal.fire({
       icon: "error",
       title: "The Password is incorrect!",
       text: "Please contact admin to get your login code.",
     });
  }
  else {
    document.getElementById("nav").classList.remove('hidden')
    document.getElementById("home").classList.add("hidden");
    document.getElementById("main").classList.remove("hidden");
    Swal.fire({
      title: "Let's Learn English Vocabularies!",
      icon: "success",
      draggable: true,
    });
  }

}

const logOut = () => {
  document.getElementById("nav").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("main").classList.add("hidden");
}



const showLoader = () => {
  document.getElementById("loader").classList.remove('hidden')
}
const hideLoader = () => {
  document.getElementById("loader").classList.add('hidden')
}

const createLessonButtons = async () => {

  const response = await fetch(
    "https://openapi.programming-hero.com/api/levels/all"
  );
  const data = await response.json();

  const lessons = data.data;

  const buttonContainer = document.getElementById("lesson-buttons");

  lessons.forEach((lesson) => {
    const button = document.createElement("button");

    button.innerHTML = `
          <button onclick='fetchWordsForLevel(${lesson.level_no})' class="btn border border-[#422AD5] text-[#422AD5] rounded-md font-semibold text-sm mx-2">  
          <span><i class="ri-book-open-fill text-base"></i></span> ${lesson.lessonName}
            </button>
          `;

    buttonContainer.appendChild(button);
  });
};

const showDetailsModal = async (videoId) => {
  const url = await fetch(
    `https://openapi.programming-hero.com/api/word/${videoId}`
  );
  const response = await url.json();
  const data = response.data;
  displayWordMOdal(data);
};

const displayWordMOdal = (detailsModal) => {
 
  document.getElementById("wordDetailsModal").showModal();
  const wordDetailsContent = document.getElementById("wordDetailsContent");
  wordDetailsContent.innerHTML = `

  

     <div class='text-left'>
     <h1 class="text-4xl font-semibold text-gray-800">${
       detailsModal.word
     } (<span><i class="ri-mic-ai-fill"></i> : </span>${
    detailsModal.pronunciation
  })</span></h1>   
            
            <h2 class="text-gray-900 font-semibold text-2xl">Meaning</h2>
            <p class="text-gray-900 font-medium text-2xl">${
              detailsModal.meaning
            }</p>
            <h2 class="text-gray-600 font-semibold">Example</h2>
            <p class="text-gray-800">${detailsModal.sentence} </p>
            <h2 class="text-gray-600 font-semibold">সমার্থক শব্দ</h2>
     </div>
   
           <div class='space-x-5 text-left'>
            ${detailsModal.synonyms
              .map((mod) => {
                return `<button class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200">${mod}</button>`;
              })
              .join("")}</div>
   
         <div class="modal-action justify-start">
      <form method="dialog">
       <button class=" bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer">
                Complete Learning
            </button>
      </form>
    </div>
    
  `;
};

const fetchWordsForLevel = async (level) => {
    showLoader();

  const response = await fetch(
    `https://openapi.programming-hero.com/api/level/${level}`
  );
  const data = await response.json();
  const words = data.data;

  const wordList = document.getElementById("words");
  wordList.innerHTML = "";

  if (words.length === 0) {
    document.getElementById("notFound").classList.add("hidden");
    wordList.innerHTML = `

        <div class="p-20 rounded-lg col-span-3">

          <div class="justify-center flex items-center">
            <img class="w-32" src="./assets/alert-error.png" alt="">
          </div>
        
            <p class="text-[#79716B] font-normal text-sm pointer-events-none">
               এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
           
            <h2 class="text-4xl font-medium text-[#292524] mt-3 pointer-events-none">
               নেক্সট Lesson এ যান
            </h2>
        </div>
  
    `;


   setTimeout(() => {
    hideLoader()
   }, 1000);
    
    return;
  }
  
  words.forEach((word) => {
    console.log(word.word)
    const div = document.createElement("div");

    div.innerHTML = `
         <div class="card text-center bg-[#FFFFFF] m-5 rounded-xl">
  <div class="card-body space-y-2">
    <h2 class="font-bold text-3xl">${word.word}</h2>
    <h2 class="font-medium text-lg">Meaning / Pronounciation</h2>
    <h2 class="font-semibold text-3xl mb-10">${word.meaning} / ${word.pronunciation}</h2>
 
    <div class="card-actions justify-between p-5">
    <button onclick='showDetailsModal(${word.id})' class="btn"><i class="ri-information-2-fill text-2xl"></i></button>
      <button onclick="speaker('${word.word}')" class="btn"><i class="ri-volume-up-fill text-2xl"></i></button>
    </div>
  </div>
</div>
    `;
    setTimeout(() => {
      wordList.appendChild(div);
      hideLoader()
    }, 1000);
      document.getElementById("notFound").classList.add("hidden");
  });
   
};

function speaker(wordSpeak) {
  console.log('click')

  const utterance = new SpeechSynthesisUtterance(wordSpeak);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
};




createLessonButtons();


