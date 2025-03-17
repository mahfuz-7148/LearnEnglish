const login = () => {
  const nameInput = document.getElementById("nameInput").value;
  const passInput = document.getElementById("passInput").value;

  if (!nameInput && !passInput) {
    Swal.fire({
      icon: "error",
      title: "Please enter your name and password!",
    });
    return
  }
  else if (!nameInput) {
    Swal.fire({
      icon: "error",
      title: "Please enter your name!",
    });
  
  } else if (passInput !== "123456") {
    Swal.fire({
      icon: "error",
      title: "The Password is incorrect!",
      text: "Please contact admin to get your login code.",
    });
  }
   
  
  else {
    document.getElementById("nav").classList.remove("hidden");
    document.getElementById("home").classList.add("hidden");
    document.getElementById("main").classList.remove("hidden");
    Swal.fire({
      title: "Let's Learn English Vocabularies!",
      icon: "success",
      draggable: true,
    });
  }
};

const logOut = () => {
  document.getElementById("nav").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("main").classList.add("hidden");
};

const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
};
const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
};


 
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
          <button id='btn-${lesson.level_no}' onclick='fetchWordsForLevel(${lesson.level_no})' class="btn border border-[#422AD5] text-[#422AD5] rounded-md font-semibold text-sm mx-2">  
          <span><i class="ri-book-open-fill text-base"></i></span> ${lesson.lessonName}
            </button>
          `;

    buttonContainer.appendChild(button);
  });
};

const fetchWordsForLevel = async (level) => {
  showLoader();

  const response = await fetch(
    `https://openapi.programming-hero.com/api/level/${level}`
  );
  const data = await response.json();

  const words = data.data;

   const activeClassRemove = () => {
     const activeBtns = document.querySelectorAll(".active");
     activeBtns.forEach((activeBtn) => {
       activeBtn.classList.remove("active");
     });
  };
  
   activeClassRemove();
   const clickedButton = document.getElementById(`btn-${level}`);
   clickedButton.classList.add("active");

  const wordList = document.getElementById("words");
  wordList.innerHTML = "";

  if (words.length === 0) {
    document.getElementById("notFound").classList.add("hidden");

    setTimeout(() => {
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
    }, 1000);

    setTimeout(() => {
      hideLoader();
    }, 1000);

    return;
  }
 

 

  words.forEach((word) => {
    console.log(word.word);
    const div = document.createElement("div");

    div.innerHTML = `
         <div class="card text-center bg-[#FFFFFF] m-5 rounded-xl">
  <div class="card-body space-y-2">
    <h2 class="font-bold text-3xl">${word.word}</h2>
    <h2 class="font-medium text-lg">Meaning / Pronounciation</h2>
    <h2 class="font-semibold text-3xl mb-10">${
      word.meaning === null || word.meaning === undefined
        ? "অর্থ পাওয়া যায়নি"
        : word.meaning
    } / ${word.pronunciation}</h2>
 
    <div class="card-actions justify-between p-5">
    <button onclick='showDetailsModal(${
      word.id
    })' class="btn"><i class="ri-information-2-fill text-2xl"></i></button>
      <button onclick="speaker('${
        word.word
      }')" class="btn"><i class="ri-volume-up-fill text-2xl"></i></button>
    </div>
  </div>
</div>
    `;

    setTimeout(() => {
      wordList.appendChild(div);
      hideLoader();
    }, 1000);
    document.getElementById("notFound").classList.add("hidden");
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

     <div class='text-left space-y-5'>
     <h1 class="text-4xl font-semibold text-gray-800">${
       detailsModal.word
     } (<span><i class="ri-mic-ai-fill"></i> : </span>${
    detailsModal.pronunciation
  })</span></h1>   
            
            <h2 class="text-gray-900 font-semibold text-2xl">Meaning</h2>
            <p class="text-gray-900 font-medium text-2xl">${
              detailsModal.meaning === null ||
              detailsModal.meaning === undefined
                ? "অর্থ পাওয়া যায়নি"
                : detailsModal.meaning
            }</p>
            <h2 class="text-gray-900 font-semibold text-2xl">Example</h2>
            <p class="text-gray-800 text-xl font-medium">${
              detailsModal.sentence
            } </p>
            <h2 class="text-gray-900 font-semibold text-xl mb-5">সমার্থক শব্দ গুলো</h2>
     </div>
   
           <div class='space-x-5 text-left'>
            ${detailsModal.synonyms
              .map((modalButton) => {
                return `<button class="bg-gray-100 text-gray-900 text-xl px-4 py-2 rounded-lg hover:bg-gray-200">${modalButton}</button>`;
              })
              .join("")}</div>
   
         <div class="modal-action justify-start">
      <form method="dialog">
       <button class=" btn rounded-md bg-[#422AD5] text-white hover:bg-[#2c1f80] cursor-pointer">
                Complete Learning
            </button>
      </form>
    </div>
    
  `;
};


function speaker(wordSpeak) {
  let voices = window.speechSynthesis.getVoices();

  function speak() {
    const utterance = new SpeechSynthesisUtterance(wordSpeak);
    utterance.lang = "en-US";

    const femaleVoice = voices.find((voice) => voice.name.includes("Zira"));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else {
      console.log("No female voice found, using default voice");
    }

    window.speechSynthesis.speak(utterance);
  }
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      speak();
    };
  } else {
    speak();
  }
}
createLessonButtons();

