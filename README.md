# Holberton SmilingSchool - JavaScript 🌟😄

![SmilingSchool Logo](images/logo.png)

Welcome to Holberton SmilingSchool! This project focuses on building a website that provides an engaging and interactive platform for learning and sharing knowledge. We use JavaScript and Bootstrap to create a modern and responsive user experience. 

## Navigation

1. Function Calls
2. Configuration
3. DOM Manipulation
   - Testimonials
   - Tutorials
   - Form
   - Shared

## 1. Function Calls

In the script, we use `$(document).ready(...)` to ensure that our code runs only after the DOM is fully loaded. This way, we can manipulate elements and apply functionalities safely. 

```javascript
$(document).ready(function () {
   loadTestimonials();
   loadTutorials('https://smileschool-api.hbtn.info/popular-tutorials', 'popular');
   loadTutorials('https://smileschool-api.hbtn.info/latest-videos', 'latest');
   getFormData();
});
```

## 2. Configuration

We define two objects, `responsiveCarousel` and `singleCarousel`, to configure the behavior of carousels in our website. These objects set properties such as autoplay, infinite loop, arrow buttons, and responsive design.

```javascript
let responsiveCarousel = {
   autoplay: true,
   infinite: true,
   slidesToShow: 4,
   slidesToScroll: 1,
   arrows: true,
   prevArrow: `<img class="a-left control-c slick-prev" src="images/arrow_black_left.png" aria-hidden="true" alt="prev">`,
   nextArrow: `<img class="a-right control-c slick-next" src="images/arrow_black_right.png" aria-hidden="true" alt="next">`,
   //...responsive breakpoints...
};

let singleCarousel = {
   autoplay: true,
   infinite: true,
   arrows: true,
   prevArrow: `<img class="a-left control-c slick-prev" src="images/arrow_white_left.png" aria-hidden="true" alt="prev">`,
   nextArrow: `<img class="a-right control-c slick-next" src="images/arrow_white_right.png" aria-hidden="true" alt="next">`
};
```

## 3. DOM Manipulation

### Testimonials

We load testimonial data from an API and create a carousel using Slick library to display the testimonials.

```javascript
function loadTestimonials() {
   $.ajax({
      type: 'GET',
      url: 'https://smileschool-api.hbtn.info/quotes',
      // ...loading, success, error, and complete functions...
   });
}

function addTestimonial(data) {
   $('.quotes').prepend(`<div>
      <!-- testimonial HTML -->
   </div>`);
}
```

### Tutorials

Similarly, we load data for popular and latest tutorials from the API and create multi-item carousels for each section.

```javascript
function loadTutorials(url, id) {
   $.ajax({
      type: 'GET',
      url: url,
      // ...loading, success, error, and complete functions...
   });
}

function addTutorial(data, id) {
   $(`#${id}`).prepend(`<div class="mx-2" id="${id}${data.id}">
      <!-- tutorial HTML -->
   </div>`);
}
```

### Form

We implement form data retrieval and filtering functionalities for courses search.

```javascript
function getFormData() {
   $('.magnify').click(() => {
      //...retrieve and filter search terms...
   });

   // ...keypress and change event listeners for search...
}

function compareFormData(search) {
   $.ajax({
      type: 'GET',
      url: 'https://smileschool-api.hbtn.info/courses',
      // ...loading, success, error, and complete functions...
   })
}

function sortFormData(videos, search) {
   //...sorting logic...
}

function addFormData(data) {
   $('#form').append(`<div class="col my-3" id="form${data.id}">
      <!-- form data HTML -->
   </div>`);
}
```

### Shared

For shared functionalities, we include the star ratings for the video tutorials.

```javascript
function includeStars(data, id) {
   // Add star rating to video tutorials
   // ...star rating logic...
}

function displayLoading(loading, tag) {
   //...showing loader during API calls...
}
```

**Happy Learning!** 😊🎉

## Author
- **Manuel Zambrano** - [mnlazs](https://github.com/mnlazs) :rage4:
