let pageId = getPageIdFromUrl();
spinner(true);


// category ID numbers data.categories
let stagesCatId = 9;
let employesCatId = 15;
let pagesCatId = 19;
let lineUpCatId = 7;
let designCatId = 20;

// // page ID numbers data.id
let infoPage = 221;
let homePage = 288;

let signUpPageId;
let lineUpPageId;

let colors = 243;
let footer = 259;

let logoUrl;

//Organized content variables.
let allPages = [];
let allStages =[];
let allEmployes = [];

const fetchUrl = 'http://markis15.dreamhosters.com/wp-json/wp/v2/'; // source
const apiKey = 'rADLmiMb7pUITg95etGWf1RnKSjKPvA0';

fetch(`${fetchUrl}posts?per_page=50`, { //request
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })

  .then(function (response) { //response to the request
    return response.json();
  })

  .then(function (data) { // we get the data and then we run the site building function.

    //console.log(data);
    if (pageId == 0) {
      for (let i = 0; i < data.length; i++) { // FIND THE ROOT PAGE OF THE SITE
        if (data[i].acf.rootPage) {
          pageId = data[i].id;
          logoUrl = data[i].acf.logo;
          break;
        }
      }
    }

  sortData(data);
  drawFooter(pageId);
  drawNav(pageId);
  drawPage(pageId);
   
  })

  .catch(function (error) { //if something goes wrong.
    console.log(error);
  });

function sortData(data) {

 // getColours(data);
getPages(data); // crate a variables from all the pages with the necessary information.
getStages(data);
getEmployes(data);

};

//--------------------------------GET PAGE ID FROM URL ------------------------------------------------
function getPageIdFromUrl() {
  let pageId = 0;
  let url = window.location.href;

  if (url.indexOf("pageId") != -1) {
    let urlSplit = url.split("?");

    if (urlSplit[1].indexOf("&") == -1) {
      let parameterSplit = urlSplit[1].split("=");
      pageId = parameterSplit[1];
    } else {


      let urlParameters = urlSplit[1].split("&");
      for (let i = 0; i < urlParameters.length; i++) {

        if (urlParameters[i].substring(0, 6) == "pageId") {
          let pageIdSplit = urlParameters[i].split("=");
          pageId = pageIdSplit[1];
          break;
        }
      }
    }
  }
  return pageId;
};
// ----------------------------------------GETS ALL THE COLORS FROM THE SERVE ----------------------------------

function getPages(data) {

  let x = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].categories.includes(pagesCatId)) {
      //console.log(data[i].acf);
      allPages[x] = data[i].acf;
      allPages[x].id = data[i].id;
      x++;
    }
    if (data[i].acf.rootPage) {
      logoUrl = data[i].acf.logo;

    }
  }
   
}

function getStages(data) {

  let x = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].categories == stagesCatId) {
      //console.log(data[i].acf);
      allStages[x] = data[i].acf;
      allStages[x].id = data[i].id;
      x++;
    }
  }
  
}

function listStages() {
  
  let stagesListString = "";
  
    for (let i = 0; i < allStages.length; i++) {
   
    let item = allStages[i];

    stagesListString += `
                  <h3>${item.stage_name}</h3>
                  <p>${item.description}</p>    
          `;    
     }


  return stagesListString;
};


function getEmployes(data) {

  let x = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].categories == employesCatId) {
      //console.log(data[i].acf);
      allEmployes[x] = data[i].acf;
      allEmployes[x].id = data[i].id;
      x++;
    }
  }
  // console.log(allEmployes);
};
// finding the root page and returning it to tge site drawing function

//------------------------------------------FIND THE CURRENT PAGE BY ID ------------------------------------------------------------------
function findPageById(pageId) {

  let page; // current page content

  for (let i = 0; i < allPages.length; i++) {
    if (allPages[i].id == pageId) {
      page = allPages[i];
      break;
    }
  }

  return page;
};

//------------------------------------------DRAW FOOTER FINISHED ------------------------------------------------------------------------
function drawFooter(pageId) {
  // console.log('footer building'); // we just have to specify how we want the footer to look
  
  fetch(`${fetchUrl}posts/259?&_fields[]=acf`, { //request ?&_fields[]=acf
    method: 'GET',    
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })

  .then(function (response) { //response to the request
    return response.json();
  })

  .then(function (data) { // we get the data and then we run the site building function.

  let footerData = data.acf;

  let guys = ` 
      <div class="musician-div">
      <div class="spacer"></div>
      <div><img class="img-1" src="${footerData.illustration1}"></div>
      <div><img class="img-2" src="${footerData.illustration2}"></div>
      <div><img class="img-3" src="${footerData.illustration3}"></div>
      <div><img class="img-4" src="${footerData.illustration4}"></div>
      </div>
      `;

  let footerString = `
      <div>
      <div class="logo-footer"> <img src="${footerData.logo}">
      </div>
      <div><p>
          Address:${footerData.address} <br>
          Tel.: ${footerData.telephone} <br>
          <a href="mailto:${footerData.email}" target="_blank">${footerData.email}</a> <br>
      </p></div>
      <div>
          <a href="${footerData.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>
          <a href="${footerData.facebook}" target="_blank"><i class="fab fa-facebook-square"></i></a>
      </div>
      </div>
      <p class="copy"> Group 3 © 2020 UCN</p>
          `;


  if (pageId != infoPage && pageId != homePage) {
    footerString = guys + footerString;
  }

  renderHTML("#footer", footerString);

  
  })

  .catch(function (error) { //if something goes wrong.
    console.log(error);
  });

  
};
//------------------------------------------DRAW THE NAVIGATION FUNCTION ----------------------------------------------------------------
function drawNav(currentPageId) {


  //console.log('drawing the navigation' + currentPageId);
  let navBarLogo = `<a href="index.html"><img src="${logoUrl}"  alt="Logo image"></a>`;
  let navBarString = '<ul>';
  const hamburgerMenu=`<div class="icon-container" onclick="hamburgerMenu(this)">
                            <div class="bar1"></div>
                            <div class="bar2"></div>
                            <div class="bar3"></div>
                          </div> 
                          `;


  for (let i = 0; i < allPages.length; i++) {
    let activePage = '';

    if (allPages[i].id == currentPageId) {
      activePage = 'class="active"';

    }

    navBarString += `
              <li ${activePage}>
                  <a href="?pageId=${allPages[i].id}">
                      ${allPages[i].title}
                  </a>
              </li>
          `;
  }


  if (screen.width > 1024) {

    navBarString = navBarLogo + navBarString + '</ul>';
    renderHTML('#navigation', navBarString);

  } else {

    renderHTML('#navigation', navBarLogo + hamburgerMenu);
    renderHTML('#hamburgerMenu', navBarString);
  }

};

function hamburgerMenu(iconPress) {
  iconPress.classList.toggle("rotate");
  
  var hamburgerMenuDiv = document.getElementById("hamburgerMenu");
  if (hamburgerMenuDiv.style.display === "flex") {
    hamburgerMenuDiv.style.display = "none";
  } else {
    hamburgerMenuDiv.style.display = "flex";
  }
}
//------------------------------------------DRAW THE CURRENT PAGE FUNCTION ---------------------------------------------------------------
function drawPage(pageId) {

  const page = findPageById(pageId);
  drawTitle(page);

  const template = page.title;

  switch (template) {
    case "Home":
      drawTemplateHome(page);
      break;

    case "Sign Up":
      drawTemplateSignUp(page);
      break;

    case "About Us":
      drawTemplateAboutUs(page);
      break;

    case "Info":
      drawTemplateInfo(page);
      break;

    case "Gallery":
      drawTemplateGallery(page);
      break;

    case "Line Up":
      drawTemplateLineUp(page);
      break;
  }

};

//----------------------------------------DRAW PAGES BY TEMPLATE--------------------------------

// ------------------ABOUT US PAGE  -----------------------
function drawTemplateAboutUs(page) {
  console.log(page);
  let content = `
                  <div class="menu-title">
                  <h2>${page.title}</h2>
                  </div>

                  <div class="about-us"> 
                  ${page.description}
                  </div>
                  `;


  renderHTML(".content-wrapper", content);
};

// ------------------SIGN UP PAGE -----------------------
function drawTemplateSignUp(page) {

  let content = `
            <div class="menu-title">
                <h2>${page.title}</h2>
            </div>

            <div class="sign-up">

           ${page.signup_form}

            </div>

            <div class="stages-div">
             <h2>Stages:</h2>
                <hr>
                <div>${listStages()}</div>
               </div>


        </div>`;

 
 
  renderHTML(".important-info", `<p>${page.other}</p>`);
  renderHTML(".content-wrapper", content);
};

// ------------------GALLERY PAGE FETCHING FUNCTION -FETCH----------------------
function drawTemplateGallery(page) {
  spinner(true);

  fetch(`${fetchUrl}media?per_page=50`, { //request
      method: 'GET',      
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    .then(function (response) { //response to the request
      return response.json();
    })

    .then(function (data) { // we get the data and then we run the site building function.
      let content = ` <div class="menu-title">
                          <h2>${page.title}</h2>
                          </div>
                          <div class="gallery-container"> `;
      for (let i = 0; i < data.length; i++) {
        if (data[i].alt_text == "gallery") {

          content += `<img class="gallery-item" src="${data[i].source_url}" alt="Images about the festival" onclick="openBig(src)">`
        }
      }
      content += '</div>';

      renderHTML(".content-wrapper", content);

    })
};

function openBig(src) {

  let bigImg = `<div id="bigImg">
                  <img src="${src}" alt="Images about the festival" onclick="closeBig(event)">
                   </div>`;

 
 if ( imageOpen == false){
  document.querySelector(".content-wrapper").innerHTML += bigImg;
  movingBox = document. querySelector("#bigImg");
  movingBox.style.top = window.pageYOffset.toString() + "px";
 // movingBox.style.top = offsetFromTop.toString() + "px";
  window. addEventListener ("scroll", moveIt(), false);
  imageOpen = true;
 } 

}

function closeBig() {
  
  event.target.parentElement.remove();
  window. removeEventListener("scroll", moveIt);
  imageOpen = false;
}


// Gallery Image Open jumpt to position 

let imageOpen = false;
const offsetFromTop = 0;
const updateFrequency= 0; //milisecond. The smaller the value, smooth the animation.
const chaseFactor = 0.2; // the closing-in factor. Smaller makes it smoother.
let movingBox ;


let yMoveTo=0;
let yDiff=0;

function moveIt() {

    yDiff = (yMoveTo - window. pageYOffset);

    if ( Math.abs(yDiff) > 9) {
        window. removeEventListener("scroll", moveIt);
        yMoveTo -= yDiff*chaseFactor;
        movingBox.style.top  = (yMoveTo+offsetFromTop).toString() + "px" ;
        setTimeout(moveIt, updateFrequency);
    } else {
        window. addEventListener ("scroll", moveIt , false); // turn back on
    }
};

// ------------------INFORMATION PAGE DRAWING FUNCTION -----------------------
function drawTemplateInfo(page) {
  console.log(page);

  const generalInfo = `
<div class="menu-title">
                <h2>${page.title}rmation</h2>
            </div>

            <div class="info-div-wrapper">
                <div class="main-info">${page.general_info}</div>

                <div class="side-note">
                    <div>
                        <div class="proh-signs">
                            <img src="${page.smoke_sign}" alt="">
                            <img src="${page.drink_sign}" alt="">
                        </div>
                        <h1>${page.policies} </h1>
                    </div>
                    <img src="${page.figure}" alt="">
                </div>

            </div>
`;

  const MoreInfo = `
<div class="menu-title">
                <h2>More Information</h2>
            </div>

            <div class="info-div-wrapper">


                <div class="main-info">

                   <p>
                  <span>Guards:</span>  <br>
                  ${page.security}.</p> 

                    <p>
                <span>Parking:</span>    <br>
                   ${page.parking}
                    <p>
                        <span>Accommodation:</span> <br>
                        ${page.accomodation}
                    </p> 

                </div>

                <div class="side-note">
                    
                ${getEmployesHere()}
                </div>


            </div>
`;


  document.querySelector('#sectionOne').classList.add('info-1');
  document.querySelector('#sectionOne').style.backgroundColor = page.header_color;
  document.querySelector('#sectionTwo').classList.add('info-2');

  renderHTML("#sectionOne", generalInfo);
  renderHTML("#sectionTwo", MoreInfo);

};

function getEmployesHere() {

  const employesData = `
  <h1>Who can help ? </h1>

                        <div>
                            <div>
                                <img src="${allEmployes[0].image}" alt="">

                                <div>
                                    <p>${allEmployes[0].name}</p>
                                    <p>${allEmployes[0].job_title}</p>
                                    <p>${allEmployes[0].phone}</p>
                                    <a href="${allEmployes[0].email}">${allEmployes[0].email}</a>
                                </div>
                            </div>

                            <div>
                            <img src="${allEmployes[1].image}" alt="">

                            <div>
                                <p>${allEmployes[1].name}</p>
                                <p>${allEmployes[1].job_title}</p>
                                <p>${allEmployes[1].phone}</p>
                                <a href="${allEmployes[1].email}">${allEmployes[1].email}</a>
                            </div>
                            </div>

                        </div>`

  return employesData
};

//------------------------------------------LINE UP PAGE FUNCTION ---FETCH---------------------------------------------------------------------
function drawTemplateLineUp(page) {
  //console.log(page);


  fetch(`${fetchUrl}posts?categories=7`, { //request     &_fields[]=acf
      method: 'GET',      
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    .then(function (response) { //response to the request
      return response.json();
    })

    .then(function (data) { // we get the data and then we run the site building function.

     // console.log(data);

      let title = `<div class="menu-title">
                   <h2>${page.title}</h2>
                   </div>`;

      let baseContainer = '<div class="lineup-container">';
      let dayOne = '';
      let dayTwo = '';
      let dayTitle = [];
      
      for (let i = 0; i < data.length; i++) {
        let base = data[i].acf;
        let day = base.day_of_performance.substring(7);

        if (base.day_of_performance.substring(0, 5) == 'day_1') {

          if (!dayTitle.includes(day) && screen.width > 1024) {
            dayTitle.push(day);
            renderHTML('#dayOne', `<h1>${day}</h1>`)
          }

          if (!dayTitle.includes(day) && screen.width < 1024) {
            dayTitle.push(day);
            renderHTML('#dayOne', title + `<h1>${day}</h1>`)
          }

          let bandId = data[i].id;
          dayOne += `
                    <div class="lineup-item" onclick="openBandPage(${bandId})" style="background-image: url(${data[i].acf.image});">
          
                    <div>
                          ${data[i].acf.band_name} <sup>${data[i].acf.nationality}</sup>
                          ${data[i].acf.stage.post_title}
                          ${data[i].acf.day_of_performance.substring(7)}
                      </div>

                      <div class="middle">
                      
                      </div>
                  </div>`;


        } else {

          if (!dayTitle.includes(day)) {
            dayTitle.push(day);
            renderHTML('#dayTwo', `<h1>${day}</h1>`);
          }
          let bandId = data[i].id;
          dayTwo += `
          
                  <div class="lineup-item" onclick="openBandPage(${bandId})" style="background-image: url(${data[i].acf.image});">
                  
                    <div>
                          ${data[i].acf.band_name} <sup>${data[i].acf.nationality}</sup>
                          ${data[i].acf.stage.post_title}
                          ${data[i].acf.day_of_performance.substring(7)}
                      </div>
                            
                      <div class="middle">
                      
                      </div>
                     
                  </div>
                  
                  `;

        }

      }

    
      if (screen.width > 1024) {

      renderHTML("#sectionOne", title + baseContainer + dayOne + '</div>');
      renderHTML("#sectionTwo", title + baseContainer + dayTwo + '</div>');
      }else{
        renderHTML("#sectionOne", baseContainer + dayOne + '</div>');
        renderHTML("#sectionTwo", baseContainer + dayTwo + '</div>');

      }

    })

    .catch(function (error) { //if something goes wrong.
      console.log(error);
    });

};


function openBandPage(bandId){

  fetch(`${fetchUrl}posts/${bandId}`, { //request
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })

  .then(function (response) { //response to the request
    return response.json();
  })

  .then(function (data) { 

    console.log(data);


  const content = `

                <div class="main-container">

                  <div class="band-container">
                      <div class="title">
                          <h2>${data.acf.band_name} - ${data.acf.stage.post_title}</h2> <a href="?pageId=${pageId}"><i class="fas fa-angle-double-left"></i></a> 
                          
                      </div>

                    <div class="info-wrapper">
                      <div>
                          <p>
                              Date: <br>
                              ${data.acf.time_of_performance} ${data.acf.day_of_performance.substring(7)}
                          </p>

                          <p>
                              Description: <br>
                              ${data.acf.description}
                          </p>

                          <div class="social-media">
                              <a href="${data.acf.instagram}"><i class="fab fa-instagram"></i></a>
                              <a href="${data.acf.facebook}"> <i class="fab fa-facebook-square"></i></a>
                              <a href="${data.acf.other}">Other Platforms...</a>
                          </div>
                      </div>
                      
                      <div class="img-box">
                          <img src="${data.acf.image}" alt="">
                      </div>
                    </div>

                      
                  </div>`;

                  renderHTML("#sectionOne", content);
                  renderHTML("#sectionTwo", "");
                  renderHTML("#dayOne", "");
                  renderHTML("#dayTwo", "");
  })
}

//------------------------------------------HOME PAGE FUNCTION ------------------------------------------------------------------------
function drawTemplateHome(page) {

  

  let sectionOne = `
  <div class="vinyl" style="background-image: url(${page.header_image});">
  <div class="header">
      <img class="title-img" src="${header()}" alt="">
  </div> 

  <div class="sticker-div">
      <img src="${page.sticker}" alt="">
  </div>

          <div class="left-right">               
                  <img src="${page.figure_1}" alt="">
                  <div class="scroll-for">
                      <h1>Scroll for <br> more info.</h1>
                      <img src="${page.arrow}" alt="More Info">
                  </div>

          </div> 


</div>`;
  let sectionTwo = `
  <div class="content-multi">
  ${page.content}

  <div class="button-signup">
      <a href="?pageId=387">Line Up <i class="fas fa-angle-double-right"></i></a> 
  </div>

</div>

<div class="line-up-images">
  <div>
       <img class="first" src="${page.image_1}" alt="Festival Image">
  </div>


  <div> 
  <img class="second" src="${page.image_2}" alt="Festival Image">
  <img class="third" src="${page.image_3}" alt="Festival Image">
  </div>
</div>`;
  let sectionThree = ` 
  <div class="content-wrapper">
  <div class="join" style=" background-image: url(${page.circle_piece});">

      <div class="cool-guy-div">
          <img src="${page.figure_2}" alt="">
      </div>


  <div class="content">
                             ${page.other_content}
      <div class="button-signup">
          <a href="?pageId=295">Sign Up <i class="fas fa-angle-double-right"></i></a> 
      </div>
  </div>

  </div>
</div>

  <div class="policies-home-page">
      <div><img src="${page.sign_smoking}" alt="">
      <img src="${page.sign_drinking}" alt=""></div>
      <h1>${page.main_policies} </h1> 
  </div>`;

  function header(){

    if (screen.width > 414) {

      return page.header_title
  
    } else {
  
      return page.phone_header_title
    }
  }

  renderHTML("#sectionOne", sectionOne);
  document.querySelector('#sectionOne').classList.add('home-page');
  document.querySelector('#sectionOne').style.backgroundColor= page.header_color;
  

  renderHTML("#sectionTwo", sectionTwo);
  document.querySelector('#sectionTwo').style.display = "flex";
  document.querySelector('#sectionTwo').classList.add('lineup-section');

  renderHTML("#sectionThree", sectionThree);
  
};

//------------------------------------------TITLE FINDER FUNCTION ------------------------------------------------------------------------
function drawTitle(page) {
  document.title = page.title + " page";
}
//------------------------------------------ HTML RENDER FUNCTION ------------------------------------------------------------------------
function renderHTML(elementId, contentToRender) {
  document.querySelector(elementId).innerHTML = contentToRender;
}
// ---------------------------------------------SPINNER ON FUNCTION------------------------------------------------------
function spinner() {
  if (true) {
    document.querySelector(".spinner").classList.add("active");
  }
}