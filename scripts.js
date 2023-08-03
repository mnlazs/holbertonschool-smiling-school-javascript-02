/* NAVIGATION
	1. Function Calls
	2. Configuration
	3. DOM Manipulation
		- Testimonials
		- Tutorials
		- Form
		- Shared
*/

/*** 1. FUNCTION CALLS ***/
/****  $(document).ready(...) indica que se está asegurando de que el código se ejecute solo después de que el DOM esté completamente cargado. 
La función $(document).ready(...) es un atajo proporcionado por jQuery para esperar a que el DOM se cargue antes de ejecutar 
el código que se encuentra dentro de ella. Es equivalente a utilizar el evento DOMContentLoaded, pero de manera más concisa.*****/

$(document).ready(function () {   
	loadTestimonials();
	loadTutorials('https://smileschool-api.hbtn.info/popular-tutorials', 'popular');
	loadTutorials('https://smileschool-api.hbtn.info/latest-videos', 'latest');
	getFormData();
});

/*** 2. CONFIGURATION ***/

let responsiveCarousel = {
	autoplay: true,
	infinite: true,
	slidesToShow: 4,
	slidesToScroll: 1,
	arrows: true,
	prevArrow: `<img class="a-left control-c slick-prev" src="images/arrow_black_left.png" aria-hidden="true" alt="prev">`,
	nextArrow: `<img class="a-right control-c slick-next" src="images/arrow_black_right.png" aria-hidden="true" alt="next">`,
	responsive: [
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 576,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
	]
};

let singleCarousel = {
	autoplay: true,
	infinite: true,
	arrows: true,
	prevArrow: `<img class="a-left control-c slick-prev" src="images/arrow_white_left.png" aria-hidden="true" alt="prev">`,
	nextArrow: `<img class="a-right control-c slick-next" src="images/arrow_white_right.png" aria-hidden="true" alt="next">`
}

/*** 3. DOM MANIPULATION ***/

/* Testimonials
   ============================= */

function loadTestimonials() {
	// Query for data for testimonials section (single-item carousel found in multiple places)
	$.ajax({
		type: 'GET',
		url: 'https://smileschool-api.hbtn.info/quotes',
		// Before - show loader
		beforeSend: (()=> displayLoading(1, '.quotes')),
		success: (data) => (data.forEach(addTestimonial)),
		error: (() => console.log('Unable to load data')),
		// After - Slick carousel and stop showing loader
		complete: (() => {
			$('.quotes').slick(singleCarousel);
			displayLoading(0, '.quotes');
		})
	});
}

function addTestimonial(data) {
	// Add html to .quotes div including dynamic data
	$('.quotes').prepend(`<div>
		<div class="row align-items-center justify-content-center">
			<div class="col-md-4 text-center">
				<img class="rounded-circle w-50 mx-auto" src="${data['pic_url']}" alt="">
			</div>
			<div class="col-md-6">
				<div class="card-body">
					<h1 class="lead">${data.text}</h1>
					<p>
						<span class="font-weight-bold">${data.name}</span>
						<br><span class="font-italic">${data.title}</span>
					</p>
				</div>
			</div>
		</div>
	</div>`);
}

/* Tutorials
   ============================= */

function loadTutorials(url, id) {
	// Query for data for popular or latest tutorials video section (multi-item carousel)
	$.ajax({
		type: 'GET',
		url: url,
		// Before - show carousel
		beforeSend: (()=> displayLoading(1, `.${id}`)),
		success: (videos) => {
			// for each tutorial, add html data and then add rating stars
			for (let video of videos) {
				addTutorial(video, id);
				includeStars(video, id);
			}
		},
		error: (() => console.log('Unable to load data')),
		// After - Slick carousel and stop showing loader
		complete: (() => {
			$(`#${id}`).slick(responsiveCarousel);
			displayLoading(0, `.${id}`);
		})
	});
}

function addTutorial(data, id) {
	// Add html to #popular or #latest div including dynamic data
	$(`#${id}`).prepend(`<div class="mx-2" id="${id}${data.id}">
			<img class="card-img-top" src="${data["thumb_url"]}" alt="">
			<div class="card-body mx-0">
				<h1 class="card-title lead font-weight-bold">${data.title}</h1>
				<p class="card-text text-secondary">${data["sub-title"]}</p>
				<div class="row">
					<img class="rounded-circle ml-2" src="${data["author_pic_url"]}" height="35px" width="35px" alt="">
					<p class="ml-3 mt-1 purple">${data.author}</p>
				</div>
				<div class="row align-items-center justify-content-between px-4">
					<div class="row" id="star${data.id}"></div>
					<p class="purple ml-2 pt-3">${data.duration}</p>
				</div>
			</div>
		</div>`);
}

/* Form
   ============================= */

function getFormData() {
	// On click of search button, gather data and send to parsing function
	$('.magnify').click(() => {
		// Clear existing data
		$('#form').empty();

		// Save current data in object
		const search_terms = {
			"search": $('#search').val().toLowerCase(),
			"topic": $('#topic').find(':selected').attr('value'),
			"sort": $('#sort').find(':selected').attr('value')
		}
		compareFormData(search_terms);
	});

	// If user presses "enter" in input field, same as button click and will trigger search
	$('#search').keypress(function (e) {
		if (e.which === 13) {
			$('.magnify').click();
		}
	});

	// Any changes to dropdowns will also trigger search
	$('#sort').change(() => $('.magnify').click());
	$('#topic').change(() => $('.magnify').click());
}

// An Ajax call is done to https://smileschool-api.hbtn.info/courses to load video cards when the page is loaded // 

function compareFormData(search) {
	// Compares data in search to data in api
	let videos = [];
	$.ajax({
		type: 'GET',
		url: 'https://smileschool-api.hbtn.info/courses',
		// Before - show carousel
		beforeSend: (()=> displayLoading(1, '#form')),
		success: (allVideos) => {
			for (let video of allVideos.courses) {
				// Put all keywords into new array as lowercase
				const arr = video.keywords.map(v => v.toLowerCase());
				// Matching search term and "all" topics
				if ((arr.includes(search.search) || (search.search == '')) && (search.topic === '1')) {
					videos.push(video);
					// Matching search term and specified topic
				} else if ((arr.includes(search.search) || (search.search == '')) && (search.topic === video.topic)) {
					videos.push(video);
				}
			}
			// Sort data by search term and add to DOM in order
			sortFormData(videos, search.sort);
			// Find total number of items in search to add on complete
			num = videos.length;
		},
		error: (() => console.log('Unable to load data')),
		// After - Add number of videos and stop showing loader
		complete: (() => {
			$('#number').html(`${num} videos`);
			displayLoading(0, '#form');
		})
	})
}

function sortFormData(videos, search) {
	// Sort by "most popular"
	if (search === '1') {
		videos.sort((a, b)=> b.star - a.star)
	// Sort by "most recent"
	} else if (search === '2') {
		videos.sort((a, b)=> b.published_at - a.published_at)
	// Sort by "most viewed"
	} else {
		videos.sort((a, b)=> b.views - a.views)
	}

	// For each video, send data to showData and includeStars
	for (let video of videos) {
		addFormData(video);
		includeStars(video, `form${video.id}`);
	}
}

function addFormData(data) {
	// Add html to .form div including dynamic data
	$('#form').append(`<div class="col my-3" id="form${data.id}">
		<img class="card-img-top" src="${data["thumb_url"]}" alt="">
		<div class="card-body">
			<h1 class="card-title lead font-weight-bold text-dark">${data.title}</h1>
			<p class="card-text text-secondary">${data["sub-title"]}</p>
			<div class="row">
				<img class="rounded-circle ml-3" src="${data["author_pic_url"]}" height="25px" width="25px" alt="">
				<p class="ml-3 purple">${data.author}</p>
			</div>
			<div class="row align-items-center justify-content-between px-4">
				<div class="row" id="star${data.id}"></div>
				<p class="purple ml-2 pt-3">${data.duration}</p>
			</div>
			</div>
		</div>
	</div>`);
}

/* ============= Shared================= */

function includeStars(data, id) {
	// Add star rating to video tutorials
	for (let on = 0; on < data.star; on++) {
		$(`#${id} #star${data.id}`).append('<img src="images/star_on.png" height="25px" width="25px" alt="">');
	}
	for (let off = 5; off > data.star; off--) {
		$(`#${id} #star${data.id}`).append('<img src="images/star_off.png" height="25px" width="25px" alt="">');
	}
}

function displayLoading(loading, tag) {
	// Adds spinner to indicate loading while API is working
	if (loading) {
		$(tag).wrap('<div class="loader"></div>');
	} else {
		$(tag).unwrap();
	}
}
