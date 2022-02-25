//=================================================
//                  Preparation
//=================================================

var settings;
var activityData;
var availableSlots;

//var numberOfPerson;
var checkInDate;

var totalPerson = 0;
var totalPersonWithLimit = 0;
var totalAddOn = 0;

var totalPriceHikingAndAddon;
var totalPriceGuideFees;
var totalPriceOverall;

var slotLeft;
var specificDateData;
var cartBasket = [];

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', loadItem);
  } else { loadItem() }

function loadItem(){
  console.log("ok");
  //const url = "https://script.google.com/macros/s/AKfycbzgyW1MUdatUzQiQu3Bp0ZYVlBY-C5IWFgyj0CD8NzPJvntcqg/exec";
  const url = "https://script.google.com/macros/s/AKfycbxz4YNCisF-lZ3R_cALAkdTTmCMmsoAVy2HragfPA/exec";
  fetch(url)
  .then(response => response.json())
  .then(data => { settings = data["settings"];
                 activityData = data["activityData"];
                 availableSlots = data["availableSlots"];
                 })
  .then(x => loadCarousel())
  .then(x => buildLandingPage());
  return;
}

//=================================================
//            build landing page from data
//=================================================
function buildLandingPage() {
  //console.log(settings);
  //console.log(activityData);
  //console.log(availableSlots);
  hideDiv("landing-page-placeholder");
  loadWebsiteTitle();
  //hideDiv("splash-image-div");
  loadSplashImage();
  loadShortIntroduction();
  loadLandingPageNotice();
  loadWebsiteFooter();
  loadTabLinks();
  showDiv("i-agree-button");
}

function loadCarousel(){
  //buildCarousel
  var allPhotos = [];
  activityData.forEach(item => {
    ((item.photo).split(",")).forEach(photo => {
      allPhotos.push(`<div class="carousel-item" data-bs-interval="2500">
      <img src="${photo}" class="img-fluid d-block w-100" alt="...">
    </div>`)
    })
  });
  allPhotos.unshift(`<div class="carousel-item" data-bs-interval="2500">
      <img src="${settings.carouselWelcomePhoto}" class="d-block w-100" alt="..."">
    </div>`);
  allPhotos.unshift(`<div class="carousel-item active" data-bs-interval="2500">
      <img src="${settings.splashImage}" class="d-block w-100" alt="...">
    </div>`);
  
  //var carouselDiv = `${allPhotos.join("")}`;
  //document.getElementById('carousel-div').innerHTML = carouselDiv;
  document.getElementById('carousel-photos').innerHTML = allPhotos.join("");
  
}

function loadShortIntroduction(){
  var markup = `<table class="table">
  <thead>
    <tr>
      <th scope="col"><small>Welcome to ${settings.projectName}</small></th>
    </tr>
  </thead>
  <tbody>
<tr>
      <td>
<small>
${settings.shortIntroduction}
</small>
      </td>
    </tr>
    
  </tbody>
</table>`;
  
  document.getElementById('short-introduction').innerHTML = markup;
}

function startCarousel(){
  //startCarousel
  var myCarousel = document.querySelector('#carouselLandingPage');
  var carousel = new bootstrap.Carousel(myCarousel);  
}

function loadTabLinks(){
  document.getElementById('booking-link').href = `${settings.bookingLink}`; 
  document.getElementById('info-link').href = `${settings.infoLink}`; 
  document.getElementById('cert-link').href = `${settings.certLink}`; 
}

function loadWebsiteFooter(){
  document.getElementById('website-footer').innerHTML = `${settings.projectName}`; 
}

function loadWebsiteTitle() { 
  document.getElementById('website-title').innerHTML = `<a href="${settings.facebookUrl}" class="navbar-brand text-decoration-none">${settings.projectName}</a>`; 
}

function loadSplashImage() { document.getElementById('splash-image').src = settings.splashImage }
function loadLandingPageNotice() { document.getElementById('landing-page-notice').innerHTML = settings.landingPageNotice }


//=================================================
//                     search
//=================================================

function searchClicked() {
  
  if (readyForSearch()) {
    hideDiv("landing-page-notice");
    search(); 
    scrollTo("search-result");
  } else { 
    scrollTo("search-error")
  }
}

function readyForSearch(){
  
  var errorMessage = "";
  
  checkInDate = document.getElementById("check-in-date").value;
  if ( checkInDate < incrementDate(formatDate(new Date()),settings.dayInAdvance) || !/\d{4}-\d{2}-\d{2}/.test(checkInDate)) errorMessage += `<br>Please select your date.<br>Please book at least ${settings.dayInAdvance} day in advance.`;
        
  if (errorMessage.length > 0) { 
    document.getElementById("search-error").innerHTML = errorMessage;
    scrollTo("search-error");
    hideDiv("search-result");
    return false;
  }
  
  return true;
}

  // numberOfPerson = document.getElementById("new-number-of-person").value;
  // if (numberOfPerson === "" || numberOfPerson === undefined) errorMessage += `<br>Please insert number of person.`;
  
function setErrorMessage(errorMessage){
  
  document.getElementById("error-message-at-cart-section").innerHTML = errorMessage;
  scrollTo("error-message-at-cart-section");
  
}

function disableButton(id){
  document.getElementById(id).disabled = true;
}

function enableButton(id){
  document.getElementById(id).disabled = false;
}

function search(){
  
  
  
  
  // here i want to have list of item available for select, and what is the maximum slot available for that day
  //then automate
  //i have checkInDate and numberOfPerson
  specificDateData = availableSlots.filter(x => x.date === checkInDate)[0];
  console.log("search clicked");
  
  slotLeft = (typeof specificDateData === 'undefined') ? -1 : specificDateData.slotLeft; // 0-50
  
//   console.log(slotLeft);
  
  
//   if (slotLeft === -1) {
//     document.getElementById("search-error").innerHTML = `Date selected not yet open for booking .`;
//     hideDiv("search-result");
//     scrollTo("search-error");
//     return;
//   }
  
//   if (slotLeft < 1) {
//     document.getElementById("search-error").innerHTML = `no more available slot for the date you selected.`;
//     hideDiv("search-result");
//     scrollTo("search-error");
//     return;
//   }
  
  
  
  
  
  //if (slotLeft > 0) 
  //then list down all hiking package to choose from
  //then
  document.getElementById("search-error").innerHTML = ""
  
  var resultDiv = document.getElementById("search-result"); 
  resultDiv.innerHTML = "";
  
  var resultForAllActivity = [];
  var thisItemSlotLeft;
  
  if (typeof specificDateData === "undefined" ) {
    
    document.getElementById("search-error").innerHTML = `date selected not yet available for booking.`;
    hideDiv("search-result");
    scrollTo("search-error");
    return;
    
  }
  
  activityData.forEach(activity => {
    
    if (activity.hasOwnQuota === "yes") thisItemSlotLeft = specificDateData[activity.code].slotLeft;
    if (activity.hasOwnQuota === "no") thisItemSlotLeft = specificDateData.slotLeft;

    //console.log(`the maximum that one can choose for ${activity.code} on ${checkInDate} is ${thisItemSlotLeft}.`);
  
    if ( parseInt(thisItemSlotLeft) > 0) resultForAllActivity.push(generateResultDiv(activity)); 
    
  });
  
  if (resultForAllActivity.length < 1 ) {
    
    document.getElementById("search-error").innerHTML = `no more available slot for the date you selected.`;
    hideDiv("search-result");
    scrollTo("search-error");
    return;
    
  }
  
  var markup = `<table class="table">
              <thead>
                <tr>
                  <th scope="col">Choose Your Package</th>
                  <th scope="col"><div style="width: 70px;"></div></th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><small><span class="text-primary">${slotLeft?? 0} slot(s) left </span>for ${checkInDate}.</small></td>
                  <td></td>
                </tr>

                ${resultForAllActivity.join("")}
              </tbody>
            </table>` 
  
  resultDiv.innerHTML = markup;
  showDiv("search-result");
  addListenerToAddToCart();
  createCartDiv();
}

function addListenerToAddToCart(){
  var addToCartButtons = document.getElementsByClassName("add-to-cart");
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }
}

function addToCartClicked(event) {
  console.log("add to cart clicked")
  //turn off search
  hideDiv("search-criteria");
  hideDiv("search-button");
  
  var activityCode = event.target.dataset.code; // code that got clicked
  var specificActivityData = activityData.find(specific => specific.code === activityCode);
  console.log(`this activity is selected and clicked`);
  console.log(specificActivityData);
  
  var thisItemSlotLeft;
  if (specificActivityData.hasOwnQuota === "yes") thisItemSlotLeft = specificDateData[activityCode].slotLeft;
  if (specificActivityData.hasOwnQuota === "no") thisItemSlotLeft = specificDateData.slotLeft;
  
  console.log(`the maximum that one can choose for this item is ${thisItemSlotLeft}.`);
  
  //console.log(`${activityCode} is selected, ${thisItemSlotLeft} slot(s) left now.`)
  //specificRoomData.availableUnits = availableUnits;
  
  addItemToCart(specificActivityData,thisItemSlotLeft); //logic will be inside here
  
//   document.getElementById("night-booked-section").innerHTML = nightBooked;
  
  updateCartTotal();
  
  showDiv("cart-section");
//   if (capacityEnough()) scrollTo("cart-section");
}

function addItemToCart(item,thisItemSlotLeft) {

  //if item exist in cartBasket
  if(cartBasket.some(x => x.code === item.code )) return scrollTo(`input-quantity-${item.code}`) 
  
  //if item not yet added, add
  item.thisActivityTotalPerson = parseInt(1);
  
  cartBasket.push(item);
  
  //now create div thing
  var photos = (item.photo).split(",");
  
  
  var tr =
`<tr>
              <td>
                <div class="container">
                  <div class="row justify-content-md-center">
                    <div class="col-md-auto">
                      <img src="${photos[0]}" class="img-fluid" alt="..." style="max-height:180px;">
                    </div>
                    <div class="col col-md">
                      <small><b>${item.title}</b></small>
                      <br><small>(${item.type})</small>
                      <br><small>MYR ${item.price} /${item.unitOfMeasurement}</small>
                      
                      <br><small><span id="extra-note-${item.code}"></span></small>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                
                <div class="btn-group">
                
                  <button class="btn btn-outline-dark btn-sm cart-decrease-button" id="decrease-button-${item.code}" type="button" onclick="decreaseItem(event,this)"><b>-</b></button>
                  
                  <span id="input-quantity-${item.code}" class="p-2">1</span>
                  
                  <button class="btn btn-outline-dark btn-sm cart-increase-button" id="increase-button-${item.code}" type="button" onclick="increaseItem(event,this)"><b>+</b></button>
                  
                </div>  
                <p>
                  <button class="btn btn-danger btn-sm mt-2 remove-button" type="button" id="remove-button-${item.code}" onclick="removeCartItem(event,this)"><small>remove</small></button>
                </p>  
                
                
                
              </td>
            </tr>`
  var cartItems = document.getElementsByClassName("cart-items")[0];
  cartItems.insertAdjacentHTML('beforeend',tr);
  scrollTo(`input-quantity-${item.code}`);
}

function removeCartItem(event,currentItem){
  var removeClickedActivityCode = (currentItem.id).split("-").splice(2).join("-");
  currentItem.parentElement.parentElement.parentElement.remove();
  removeItemFromArray(cartBasket.find(specific => specific.code === removeClickedActivityCode),cartBasket);
  updateCartTotal();
}

function increaseItem(event,currentItem){
  var increaseClickedActivityCode = (currentItem.id).split("-").splice(2).join("-");
  var currentValue = document.getElementById(`input-quantity-${increaseClickedActivityCode}`).innerHTML;
  var newQuantity =  parseInt(currentValue) + 1;
  
  var thisItemSlotLeft;
  var activity = cartBasket.find(specific => specific.code === increaseClickedActivityCode)
   if (activity.hasOwnQuota === "yes") thisItemSlotLeft = specificDateData[activity.code].slotLeft;
   if (activity.hasOwnQuota === "no") thisItemSlotLeft = specificDateData.slotLeft;
  //console.log(`this item can increase up to ${thisItemSlotLeft}`)
  
  newQuantity = newQuantity > thisItemSlotLeft ? thisItemSlotLeft : newQuantity;
  document.getElementById(`input-quantity-${increaseClickedActivityCode}`).innerHTML = newQuantity;
  cartBasket.find(specific => specific.code === increaseClickedActivityCode).thisActivityTotalPerson = parseInt(newQuantity);
  updateCartTotal();
}

function decreaseItem(event,currentItem){
  var increaseClickedActivityCode = (currentItem.id).split("-").splice(2).join("-");
  var currentValue = document.getElementById(`input-quantity-${increaseClickedActivityCode}`).innerHTML;
  var newQuantity =  (parseInt(currentValue) - 1) > 0 ? parseInt(currentValue) - 1 : 1;
  document.getElementById(`input-quantity-${increaseClickedActivityCode}`).innerHTML = newQuantity;
  cartBasket.find(specific => specific.code === increaseClickedActivityCode).thisActivityTotalPerson = parseInt(newQuantity);
  updateCartTotal();
}

function updateCartTotal() {

  totalPersonWithLimit = updateTotalPerson();
  var guideFee = updateGuideFee();
  updatePriceSummary(guideFee);

}

function updateTotalPerson() {
  
//=================================================
//         totalPerson - limit by quota
//=================================================
  var quantityBookedWithLimitArray = cartBasket
                            .filter(item => item.countToQuota === "yes")
                            .map(item => parseInt(item.thisActivityTotalPerson));
   
  totalPerson = 0;
  if(quantityBookedWithLimitArray.length > 0) totalPerson = quantityBookedWithLimitArray.reduce((prev,next) => prev + next);
  //console.log(`changing total-person-with-limit to ${totalPerson}`);
  
  var errorMessage = "";
  if (totalPerson > slotLeft) errorMessage += `Error: only has ${slotLeft} slot(s) left for ${checkInDate}, please adjust your number of person to continue.`;
  if (errorMessage.length > 0 ) setErrorMessage(errorMessage); //if got errorMessage it will show, else it will be just  ""
  
  document.getElementById("total-person-with-limit").innerHTML = `${totalPerson} person<br>${"👤".repeat(parseInt(totalPerson))}`;
  
//=================================================
//              totalAddOn - AddOn or Other
//=================================================
  var quantityBookedWithoutLimitArray = cartBasket
                            .filter(item => item.countToQuota === "no")
                            .map(item => parseInt(item.thisActivityTotalPerson));
   
  totalAddOn = 0;
  if(quantityBookedWithoutLimitArray.length > 0) totalAddOn = quantityBookedWithoutLimitArray.reduce((prev,next) => prev + next);
  //console.log(`changing total-person-with-limit to ${totalAddOn}`);
  
  document.getElementById("total-add-on").innerHTML = totalAddOn;
  
//=================================================
//              totalPerson
//=================================================
  var totalItem = parseInt(totalPerson) + parseInt(totalAddOn);
  document.getElementById("total-item").innerHTML = totalItem;
  
  return totalPerson;
}



function updateGuideFee(){
  
  hideDiv("guide-fee-row");
  var totalGuideFee = 0;
  var totalGuide = 0;
  var plural = '';
  
  if ( totalPersonWithLimit > 0 )  {
    showDiv("guide-fee-row");
    
//     //total guide fee equals to
//     var totalGuideFee = 0;
    
    
    cartBasket.forEach(activity => {
      var thisActivityTotalGuide = activity.needGuide === "yes" ? Math.ceil(activity.thisActivityTotalPerson / activity.paxPerGuide) : 0;
      
      if (parseInt(thisActivityTotalGuide) < parseInt(activity.minGuide)){
        thisActivityTotalGuide = activity.minGuide
      }
      
      var thisActivityTotalGuideFee = thisActivityTotalGuide * activity.guideFee; //number of guide needed x guide fee
      
      totalGuideFee += thisActivityTotalGuideFee;
      totalGuide += thisActivityTotalGuide;
      plural = parseInt(totalGuide) > 1 ? "s" : "" ;
      //add to cartBasket
      activity.thisActivityTotalGuide = thisActivityTotalGuide;
      activity.thisActivityTotalGuideFee = thisActivityTotalGuideFee;
    })
  }
  
  document.getElementById("guide-fee").innerHTML = totalGuideFee;
  document.getElementById("total-guide").innerHTML = totalGuide;
  document.getElementById("total-guide-plural").innerHTML = plural;
  return totalGuideFee;
  
}

function updatePriceSummary(guideFee) {
  
  
  totalPriceBeforeTax = 0
  totalPriceOverall = 0
  
  cartBasket.forEach(activity => {
      
      var thisActivityTotalPriceBeforeTax = activity.price * activity.thisActivityTotalPerson;
      
      totalPriceBeforeTax += thisActivityTotalPriceBeforeTax
      
      //update cartBasket
      activity.thisActivityTotalPriceBeforeTax = thisActivityTotalPriceBeforeTax;
      activity.thisActivityTotalPriceAfterTax = thisActivityTotalPriceBeforeTax + activity.thisActivityTotalGuideFee;
  })
  
  document.getElementById("total-price-before-tax").innerHTML = `<small>MYR ${totalPriceBeforeTax.toFixed(2)}</small>`
  
  totalPriceHikingAndAddon = parseInt(totalPriceBeforeTax);
  totalPriceGuideFees = parseInt(guideFee);
  
  totalPriceOverall = totalPriceHikingAndAddon + totalPriceGuideFees;
  
  document.getElementById("total-price-after-tax").innerHTML = `<small><b>MYR ${totalPriceOverall.toFixed(2)}</b></small>`
  
  //update cartBasket outside of activity
  cartBasket.totalPriceOverall = totalPriceOverall;

}

function quantityChanged(event){
  var quantityChangedRoomCode = (event.id).split("-").splice(2).join("-");
  var newQuantity = event.value;
  cartBasket.find(specific => specific.code === quantityChangedRoomCode).thisActivityTotalPerson = parseInt(newQuantity);
  
  //if(this.value > ${thisItemSlotLeft}) this.value = ${thisItemSlotLeft};if(this.value < 1) this.value = 1;"
//   var specificRoomData = cartBasket.find(specific => specific.code === quantityChangedRoomCode);
//   console.log(specificRoomData);
  
//   var insertedValue = event.value;
//   var newQuantity = insertedValue;
//   if (insertedValue > specificRoomData.availableUnits) {
//     newQuantity = specificRoomData.availableUnits;
//     document.getElementById(event.id).value = newQuantity;
//   }
  
  
  updateCartTotal();
  //console.log(quantityChangedRoomCode); //activity1
  
  //console.log(specificRoomData); // object of that activity
  //var insertedValue = event.value;

//   if (insertedValue > specificRoomData.availableUnits) {
//     newQuantity = specificRoomData.availableUnits;
//     document.getElementById(event.id).value = newQuantity;
//   }
  
//   if (insertedValue < 1 ) {
//     newQuantity = 1;
//     document.getElementById(event.id).value = newQuantity;
//   } 
  

  
  //push update to cartBasket
  //console.log(cartBasket)
  //var specificRoomData = cartBasket.find(specific => specific.code === quantityChangedRoomCode);
  //specificRoomData.quantityBooked = parseInt(newQuantity);
}

 

function createCartDiv() {
  var markup =
`<table class="table">
          <thead>
            <tr>
              <th scope="col">Booking Details</th>
              <th scope="col" style="width:4%"></th>
            </tr>
          </thead>
          
          <tbody class="cart-items">
            <tr>
              <td><small>${checkInDate} <span class="text-warning">(${slotLeft} slot left)</span>
              <span class="d-none"><span id="total-item">0</span> item(s) booked, which includes:</span>
              <br><span id="total-person-with-limit">0</span>
              <br>...and <span id="total-add-on">0</span> AddOn(s)
              
              <br>Promo Rate</small>
              <br><b><span id="error-message-at-cart-section" class="text-danger"></span></b>
              </td>
              <td></td>
            </tr>
            
            
            
            
            
          
        </tbody>
      </table>
      

        
        <table class="table">
          <thead>
            <tr>
              <th scope="col"><small>Price Summary</small></th>
              <th scope="col"><div style="width: 150px;"></div></th>
            </tr>
          </thead>
          
          <tbody>
            
            <tr>
              <td>
                <small>Hiking & AddOn</small>
              </td>
              
              <td>
                <div class="card text-right" id="total-price-before-tax"><small>MYR 0.00</small></div>
              </td>
            </tr>
            
            <tr>
              <td>
                <small><div id="guide-fee-row">Guide Fees</div></small>
              </td>
              
              <td>
                <div class="card text-right"><small>MYR <span id="guide-fee">0</span>.00 (<span id="total-guide">0</span> guide<span id="total-guide-plural"></span>)</small></div>
              </td>
            </tr>
            
            
            <tr>
              <td>
                <small>Taxes</small>
              </td>
              
              <td>
                <div class="card text-right"><small>MYR 0.00</small></div>
              </td>
            </tr>
            
            
            <tr>
              <td>
                <small><b>Total Price</b></small>
              </td>
              
              <td>
                <div class="card text-right" id="total-price-after-tax"><small><b>MYR 0.00</b></small></div>
              </td>
            </tr>
            
            
          </tbody>
        </table>
        
        <div id="booking-duplicate-error" class="d-none">
          <table class="table">
            <thead>
              <tr>
                <th scope="col"><small>ERROR</small></th>
                <th scope="col"><div style="width: 200px;"></div></th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <small>Error</small>
                </td>

                <td>
                  <div class="card text-right text-danger"><b>Duplicate submission detected.</b></div>
                </td>
              </tr>

              <tr>
                <td>
                  <small>Error details</small>
                </td>

                <td>
                  <div class="card text-right"><small>Same submission was received twice.</small></div>
                </td>
              </tr>
              
              <tr>
                <td>
                  <small>Solution</small>
                </td>

                <td>
                  <div class="card text-right"><small>Please try again, or contact customer service at <br><b>${settings.customerServiceLine}</b>.</small></div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        
        <div id="booking-error" class="d-none">
          <table class="table">
            <thead>
              <tr>
                <th scope="col"><small>ERROR</small></th>
                <th scope="col"><div style="width: 200px;"></div></th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <small>Error</small>
                </td>

                <td>
                  <div class="card text-right text-danger"><b>Your booking cannot be processed.</b></div>
                </td>
              </tr>

              <tr>
                <td>
                  <small>Error details</small>
                </td>

                <td>
                  <div class="card text-right"><small>Someone else booked the same slot before you do. Therefore the slot is no longer available.</small></div>
                </td>
              </tr>
              
              <tr>
                <td>
                  <small>Solution</small>
                </td>

                <td>
                  <div class="card text-right"><small>Please refresh this page and book again.</small></div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        
        
        <div id="payment-information" class="d-none">
          <table class="table">
            <thead>
              <tr>
                <th scope="col"><small>Payment Information</small></th>
                <th scope="col"><div style="width: 200px;"></div></th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <small>Reference</small>
                </td>

                <td>
                  <div class="card text-right text-danger"><b><span id="ref-number"></span></b></div>
                </td>
              </tr>

              <tr>
                <td>
                  <small>Bank in / Transfer</small>
                </td>

                <td>
                  <div class="card text-right">${settings.bankAccount}</div>
                </td>
              </tr>
              
              <tr>
                <td>
                  <small>Status</small>
                </td>

                <td>
                  <div class="card text-right"><small>Good news! The selected slots are temporary reserved for you.<br><br>Please make your payment for Hiking & AddOn <b><span class="text-danger">MYR </span><span id="total-price-hiking-and-addon" class="text-danger"></span></b> immediately to our bank account. Kindly use your Reference <b><span id="ref-number-in-status-row" class="text-danger"></span></b> as the payment reference.<br><br>Booking is not confirmed until you have made the payment within 30 minutes after the booking.<br><br>For the guide fees of <span class="text-primary">MYR </span><span id="total-price-guide-fees" class="text-primary"></span>, please pay at the starting point later by cash.</small></div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        
        <div id="contact-information">
          <table class="table">
            <thead>
              <tr>
                <th scope="col"><small>Contact Information</th>
                <br><b><div id="error-message" class="d-grid mx-auto text-danger" style="font-size:14px;"></div></b></small>
                <th scope="col"><div style="width: 150px;"></div></th>

              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <small>Full Name</small>
                </td>

                <td>
                  <div class="card text-right"><small><input type="text" class="form-control form-control-sm contact-information" id="new-name" placeholder="Your Name" onchange="contactInformationChecking(event,this)"></small></div>
                </td>
              </tr>

              <tr>
                <td>
                  <small>Phone Number</small>
                </td>

                <td>
                  <div class="card text-right"><small><input type="text" class="form-control form-control-sm contact-information" id="new-hp" placeholder="+60123456789"></small></div>
                </td>
              </tr>

              <tr>
                <td>
                  <small>Email</small>
                </td>

                <td>
                  <div class="card text-right"><small><input type="email" class="form-control form-control-sm contact-information" id="new-email" placeholder="youremail@gmail.com"></small></div>
                </td>
              </tr>

              <tr>
                <td>
                  <small>Special Notes</small>
                </td>

                <td>
                  <div class="card text-right"><small><textarea class="form-control form-control-sm contact-information" id="new-request" rows="3" placeholder="Is there anything else you'd want us to take note?" onchange="contactInformationChecking(event,this)"></textarea></small></div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        <div id="terms-and-conditions">
          ${settings.landingPageNotice}
        </div>
        
        <div class="d-grid gap-2 ms-3 mb-3">
          <button class="btn btn-primary btn-warning shadow col-6" id="book-button" type="submit"><small>BOOK MY TRIP</small></button>
        </div>
        <div class="d-grid gap-2 ms-3 d-none" id="loading-button">
          <button class="btn btn-primary btn-warning shadow col-6" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </button>
          <small><span class="text-warning">Please be patient while we process your booking,
          <br>The process normally takes about 1 minute...
          </span></small>
        </div>
         
         <!--div class="ratio ratio-1x1">
           <iframe src="https://script.google.com/macros/s/AKfycbx22NNC-7JRBS1QkuJZILN5XXaiVMCAqtO5NFK5MVDYD5Xro-gh/exec"></iframe>
         </div-->
         
         <div class="d-grid gap-2 ms-3 d-none" id="submit-receipt-button">
          <button class="btn btn-primary gap-1 shadow col-6" onclick="openInNewTab('${settings.paymentFormUrl}');" type="submit"><small>Submit Payment Proof</small></button>
         </div>
         
         <div class="row d-grid gap-2 ms-3 d-none" id="payment-options">
         <br>Useful Links:
            <div class="col">
              <button class="btn m-1 gap-1 btn-warning col-4" onclick="openInNewTab('https://www.maybank2u.com.my/');" type="submit"><small>Maybank2U</small></button>
              <button class="btn m-1 gap-1 btn-danger col-4" onclick="openInNewTab('https://www.cimbclicks.com.my/');" type="submit"><small>CIMBClicks</small></button>
              <button class="btn m-1 gap-1 btn-outline-danger col-4" onclick="openInNewTab('https://www.pbebank.com');" type="submit"><small>Public Bank</small></button>
              <button class="btn m-1 gap-1 btn-outline-primary col-4" onclick="openInNewTab('https://www.alliancebank.com.my/');" type="submit"><small>Alliance</small></button>
              <button class="btn m-1 gap-1 btn-info col-4" onclick="openInNewTab('https://www.rhbgroup.com/');" type="submit"><small>RHB Bank</small></button>
              <!--button class="btn m-1 gap-1 btn-danger col-4" onclick="openInNewTab('https://telegra.ph/file/28298a912d32d3873c49d.jpg');" type="submit"><small>Boost</small></button-->
              <button class="btn m-1 gap-1 btn-outline-primary col-4" onclick="openInNewTab('https://www.hlb.com.my/');" type="submit"><small>Hong Leong</small></button>
              <button class="btn m-1 gap-1 btn-outline-danger col-4" onclick="openInNewTab('https://www.ambank.com.my');" type="submit"><small>Ambank</small></button>
              <button class="btn m-1 gap-1 btn-outline-danger col-4" onclick="openInNewTab('https://www.bankislam.biz/');" type="submit"><small>Bank Islam</small></button>
              <button class="btn m-1 gap-1 btn-outline-primary col-4" onclick="openInNewTab('https://www2.irakyat.com.my/personal/login/login.do?step1=');" type="submit"><small>Bank Rakyat</small></button>
              <button class="btn m-1 gap-1 btn-outline-primary col-4" onclick="openInNewTab('https://www.i-muamalat.com.my/rib/index.do" type="submit"><small>Bank Muamalat</small></button>
            </div>
         </div>
         `
  
  document.getElementById("cart-section").innerHTML = markup;
  document.getElementById("book-button").addEventListener('click', function(event) {
        //event.preventDefault();
        bookClicked();
      });
}


  
function generateResultDiv(activity){
  // console.log(`result div generated`);
  // console.log(activity)
  var specificActivityData = activityData.find(specific => specific.code === activity.code)
  
  var photos = (activity.photo).split(",");
  var roomPhotosDiv = "";
  photos.forEach(photo => roomPhotosDiv += createActivityPhotosDiv(photo)) //comma not from here
  
  var activityDetails = (activity.details).split(",");
  var activityDetailsDiv = "";
  activityDetails.forEach(line => activityDetailsDiv += createLi(line))  //comma not from here
  
  var itineraryDetails = "";
  var itineraryDetailsDiv = "";
  if ((activity.itinerary).length > 0) {
    itineraryDetails = (activity.itinerary).split(",");
    itineraryDetails.forEach(line => itineraryDetailsDiv += createLi(line));
    itineraryDetailsDiv = `<small>
                                        <b>Itinerary:</b>
                                        <ul>
                                          ${itineraryDetailsDiv}
                                        </ul>
                                      </small>`;
  }
  
  //var itineraryDetails =   `<small><b>Itinerary:</b><ul>${createLi((activity.itinerary).split(","))}</ul></small>` : '';
  
  // var activityBadge = activity.badge === '-' ? '' : `<span class="badge rounded-pill bg-success">${activity.badge}</span>`;
  
  var activityBadge = "";
  if (activity.badge !== '-') {
    ((activity.badge).split(",")).forEach(icon => {
    activityBadge += ` <span class="badge rounded-pill bg-success">${icon}</span>`});
    //activityBadge += `<br>`;
  }
  
  var markup = //new
`<tr>
                  <td><!--every result row-->
                    <div class="container">
                      <div class="row justify-content-md-center">
                        <div class="col-sm">
                          <img src="${photos[0]}" class="img-fluid" alt="...">
                        </div>
                        <div class="col col-sm">
                          <small><b>${activity.title}</b></small>
                          ${activityBadge}
                          <br><small>(${activity.type})</small>
                          
                          <br><small>${activity.needGuide === "yes" ? `Guide: rm${activity.guideFee}/${activity.paxPerGuide}pax` : ``}</small>
                          

                          <p>
                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#details${activity.code}">
                              Details>
                            </button>

                            <!-- Modal -->
                            <div class="modal fade" id="details${activity.code}" tabindex="-1" aria-labelledby="details${activity.code}" aria-hidden="true">
                              <div class="modal-dialog">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <h5 class="modal-title">${activity.title}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div class="modal-body">
                                    <div class="card card-body mb-3">

                                      <small>
                                        <b>Details:</b>
                                        <ul>
                                          ${activityDetailsDiv}
                                        </ul>
                                      </small>
                                       
                                      ${itineraryDetailsDiv}
                                       
                                      <small><b>Photos:</b></small>

                                      ${roomPhotosDiv}

                                    </div>
                                  </div>
                                  <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </p>






                          <!--p>
                            <button class="btn btn-light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${activity.code}" aria-expanded="false"">

                              <small>Details ></small>
                            </button>
                          </p>
                          <div style="min-height: 5px;">
                            <div class="collapse" id="collapse${activity.code}">
                              <!--div class="card card-body mb-3" style="width: 450px;">

                                <small>
                                  <b>Details</b>
                                  <ul>
                                    ${activityDetailsDiv}
                                    ${itineraryDetails}
                                  </ul>
                                </small>

                                ${roomPhotosDiv}

                              </div>
                            </div>
                          </div-->



                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <small><b>MYR ${activity.price}</b></small><br>
                    <p class="text-end"><small>/${activity.unitOfMeasurement}</small><br>
                    <button type="button" class="btn btn-sm btn-warning add-to-cart" data-code="${activity.code}">SELECT</button></p>
                  </td>
                </tr>`      
  
  

  
  return markup;
}

function createLi(line){
  var markup = `<li>${line}</li>`;
  return markup;  
}

function createActivityPhotosDiv(photo){
  var markup =`<img src="${photo}" class="img-fluid img-thumbnail" alt="...">`;
  return markup;
}

//=================================================
//             Book Function
//=================================================
function bookClicked(){
  disableButton("book-button");
  showLoadingButton();
  if (errorChecking("scroll") === "error") { 
    hideLoadingButton();
    enableButton("book-button");
    return;
  }
  
  var bookingSummary = getBookingSummary();
  if (bookingSummary === "error") {
    hideLoadingButton();
    enableButton("book-button");
    return;
  }
  // console.log(bookingSummary);
  // return;
  callMYApi(bookingSummary);
}

function getBookingSummary(){
  
  var cartBasketSummary = errorChecking("scroll");
  if (cartBasketSummary === "error") return "error"
  return serialize(cartBasketSummary);
  
}

function showLoadingButton(){
  //console.log("book-button clicked.");
  hideDiv("book-button");
  showDiv("loading-button");
}

function hideLoadingButton(){
  hideDiv("loading-button");
  showDiv("book-button");
}

function gotError(){
  var errorMessageAtCartSection = document.getElementById("error-message-at-cart-section").innerHTML;
  if (errorMessageAtCartSection.length > 0) {
    console.log("got error");
    if (option === "scroll") scrollTo("error-message-at-cart-section");
    return true;
  }
  return false;
}

function contactInformationChecking(e,currentItem){
  //console.log(e.target.value);
  //console.log(currentItem);
  //console.log(currentItem.id);
  if (currentItem.id === "new-name") {
    document.getElementById(currentItem.id).value = capitalizeFirstLetter(removeSpecialCharacters(e.target.value));
  }
  if (currentItem.id === "new-request") {
    document.getElementById(currentItem.id).value = removeSpecialCharacters(e.target.value);
  }
}

function removeSpecialCharacters(input) { 
	return(input
	.replace(/[^\w\s]/gi, '')
	//.replace(/\w+/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1); })
	//.replace(/\s/g, '')
	)
}

function capitalizeFirstLetter(input) {
  return(input.replace(/\w+/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1); }))
  //return input.charAt(0).toUpperCase() + input.slice(1);
}

function errorChecking(option){//option = empty, or "scroll"
  //capacity check
  
  if(gotError()) return "error";
  
  //booking details check
  var errorMessage = "";
  
  var customerEmail = document.getElementById("new-email").value;
  
  var customerHpRaw = document.getElementById("new-hp").value.replace(/\D/g, '');
  var customerHp = customerHpRaw;
  if (customerHpRaw.startsWith("0")) customerHp = `'${customerHpRaw}`;
  if (customerHpRaw.startsWith("6")) customerHp = `'${customerHpRaw.substring(1)}`;
  
  var customerNameRaw = document.getElementById("new-name").value;
  var customerName = customerNameRaw.toLowerCase().replace(/\w+/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1); }).replace(/\s/g, '');
  
  var customerRequest = document.getElementById("new-request").value;
  
  //if (customerName.length < 3) errorMessage += `<br>Please insert a name.`;
  if (!validateName(customerName)) errorMessage += `<br>Please insert a name.`;
  
  if (customerHp.length < 10) errorMessage += `<br>Please insert a hp number.`; 
  if (!validateEmail(customerEmail)) errorMessage += `<br>Please enter an email.`;
  
  document.getElementById("error-message").innerHTML = errorMessage;
  if (errorMessage.length > 0) {
    console.log("got error when doing error checking.");
    if (option === "scroll") scrollTo("error-message");
    return "error";
  }
  
  var itemBooked = (cartBasket.map(x => `${x.thisActivityTotalPerson}thisActivityTotalPerson${x.code}code${x.thisActivityTotalGuide}thisActivityTotalGuide`)).join("_");
  
  var cartBasketSummary = {
    dateBooked: checkInDate,
    //nightBooked: nightBooked,
    customerName: customerName,
    customerHp: customerHp,
    customerEmail: customerEmail,
    itemBooked: itemBooked,
    // totalPriceHikingAndAddon: totalPriceHikingAndAddon,
    // totalPriceGuideFees: totalPriceGuideFees,
    totalPrice: totalPriceOverall,
    customerRequest: customerRequest,
  };
  
  return cartBasketSummary;
}

function callMYApi(bookingSummary){
  
  var webAppUrl = "https://script.google.com/macros/s/AKfycbzvrFL5A0ms9Hagfj5qtEzH4vPQyMjj3g7jguSn_nCy6g8nGNg/exec";
  var url = webAppUrl + "?" + bookingSummary;
  console.log(url);
  
  var promise = Promise.resolve();
  promise = promise
    .then(() => fetch(url)
    .then(response => response.json())
    .then(data => { 
                    if( data["data"] === "error" ) {
                      console.log("error occured in booking server.");
                      showBookingError();
                      return;
                    }
                    if( data["data"] === "duplicate-error" ) {
                      console.log("duplicate-error occured in booking server.");
                      showBookingDuplicateError();
                      return;
                    }
                    
                    showPaymentInformation(data);
                    tidyUpPaymentScene();
    }))
}

function showPaymentInformation(data){
  customerRef = data["customerRef"];
  // console.log(data["data"]);
  console.log(`customerRef obtained from server is ${customerRef}`);
  showDiv("payment-information");
  document.getElementById("ref-number").innerHTML = customerRef;
  document.getElementById("ref-number-in-status-row").innerHTML = customerRef;
  document.getElementById("total-price-hiking-and-addon").innerHTML = totalPriceHikingAndAddon;
  document.getElementById("total-price-guide-fees").innerHTML = totalPriceGuideFees;
  // document.getElementById("total-price-in-status-row").innerHTML = totalPriceOverall; //turned off because we now only need to pay hiking and addons
  scrollTo("payment-information");
}

function showBookingError(){
  showDiv("booking-error");
  scrollTo("booking-error");
  hideDiv("search-criteria");
  hideDiv("search-result");
  hideDiv("contact-information");
  hideDiv("terms-and-conditions");
  hideDiv("loading-button");
}

function showBookingDuplicateError(){
  showDiv("booking-duplicate-error");
  scrollTo("booking-duplicate-error");
  hideDiv("search-criteria");
  hideDiv("search-result");
  hideDiv("contact-information");
  hideDiv("terms-and-conditions");
  hideDiv("loading-button");
}

function tidyUpPaymentScene(){
  showDiv("payment-options");
  showDiv("submit-receipt-button");
  hideOtherDiv();
  disableFurtherInput();
}

function disableFurtherInput(){
  disableDivByClass("cart-quantity-input");
  //disableDivByClass("extra-bed-input");
  disableDivByClass("contact-information");
}

function hideOtherDiv() {
  hideDiv("loading-button");
  hideDiv("contact-information");
  hideDiv("terms-and-conditions");
  hideDiv("book-button");
  hideDiv("search-criteria");
  hideDiv("search-result");
  var array = document.getElementsByClassName("remove-button");
  for(var i = 0; i < array.length; i++) {
    array[i].classList.add("d-none");
  }
  array = document.getElementsByClassName("cart-decrease-button");
  for(var i = 0; i < array.length; i++) {
    array[i].classList.add("d-none");
  }
  array = document.getElementsByClassName("cart-increase-button");
  for(var i = 0; i < array.length; i++) {
    array[i].classList.add("d-none");
  }
}


//=================================================
//           Other Additional Function
//=================================================

function disableDivByClass(className) {
  var array = document.getElementsByClassName(className);
  for(var i = 0; i < array.length; i++) {
    array[i].disabled = true;
  }
}

function openInNewTab(url) {
 window.open(url, '_blank').focus();
}

function showDiv(id) {
  document.getElementById(id).classList.remove('d-none');
}

function hideDiv(id) {
  document.getElementById(id).classList.add('d-none');
}

function validateName(name){
  var re = /^[0-9a-zA-Z]{3}([0-9a-zA-Z ]+)?/;
  return re.test(name);
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// function validateDateInput(date) {
//   const re = /\d{4}-\d{2}-\d{2} ~ \d{4}-\d{2}-\d{2}/
//   return re.test(date);
// }

function scrollTo(id) {
    var element = document.getElementById(id);
    var headerOffset = 60;
    var elementPosition = element.offsetTop;
    var offsetPosition = elementPosition - headerOffset;
    document.documentElement.scrollTop = offsetPosition;
    document.body.scrollTop = offsetPosition; // For Safari
}

function getTimeStamp(){
  return(Math.round(new Date().getTime()))
}

serialize = function(obj, prefix) {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push((v !== null && typeof v === "object") ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
  }

// $(document).ready(function() {
//                         $('.minus-btn').on('click',function () {
//                                 var $input = $(this).parent().find('input.qty_input');
//                                 var count = parseInt($input.val()) - 1;
//                                 count = count < 1 ? 1 : count;
//                                 $input.val(count);
//                                 $input.change();
        
//         var $human = $(this).parent().parent().find('button.human');
//         var $humanCount = parseInt($input.val());
//         var $humanIcon = "👤";
//         $human[0].innerHTML = $humanIcon.repeat($humanCount);
        
//                                 return false;
//                         });
//                         $('.plus-btn').on('click',function () {
//                                 var $input = $(this).parent().find('input.qty_input');
//                                 $input.val(parseInt($input.val()) + 1);
//                                 $input.change();
        
//         var $human = $(this).parent().parent().find('button.human');
//         var $humanCount = parseInt($input.val());
//         var $humanIcon = "👤";
//         $human[0].innerHTML = $humanIcon.repeat($humanCount);
        
//                                 return false;
//                         });
// });

function formatDate(date) {
    var d = (new Date(date)/*.addHours(12)*/),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function rowsToObjects(headers, rows){ 
  return rows.reduce((acc, e, idx) =>  {
     acc.push(headers.reduce((r, h, i)=> {r[h] = e[i]; return r; }, {}))
     return acc;
  }, []);
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function createLi(line){
  var markup = `<li>${line}</li>`;
  return markup;  
}

// function createRoomPhotosDiv(photo){
//   var markup =`<img src="${photo}" class="img-fluid img-thumbnail" alt="...">`;
//   return markup;
// }

function removeItemFromArray(item,array){
    const index = array.indexOf(item);
    if (index > -1) array.splice(index, 1);
}

function incrementDate(date_str, incrementor) {
    var parts = date_str.split("-");
    var dt = new Date(
        parseInt(parts[0], 10),      // year
        parseInt(parts[1], 10) - 1,  // month (starts with 0)
        parseInt(parts[2], 10)       // date
    );
    dt.setTime(dt.getTime() + incrementor * 86400000);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
        parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
        parts[2] = "0" + parts[2];
    }
    return parts.join("-");
}
