import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30777543-e493bf0203eb427eb0034605d';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let perPage = 40;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchValue = input.value.trim();
    if(searchValue) {
        page = 1;
        gallery.innerHTML = '';
    } 

    try {
        const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
        if(response.data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        if(response.data.hits.length > 0) {
            loadMoreBtn.classList.remove('is-hidden');
            createCardMarkup(response.data.hits);
            new SimpleLightbox('.gallery a', {
                captionsData: "alt",
                captionDelay: 250,
            }).refresh();
            Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
            
        }
    }catch(err) {
        console.log(err);
    }

});

loadMoreBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const searchValue = input.value;
    if(searchValue) {
        page += 1;
    }

    try{
        const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
        createCardMarkup(response.data.hits);
        new SimpleLightbox('.gallery a', {
            captionsData: "alt",
            captionDelay: 250,
        }).refresh();
        if(response.data.totalHits/perPage < page) {
            loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        }
    }catch(err){
        console.log(err);
    }

})


function createCardMarkup(arr) {
    const galleryCardMarkup = arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
    return `
    
    <div class="photo-card">
        <a class = "photo-card" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width = 250 heigth = 250/>
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments; ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                </p>
            </div>
        </a>
    </div>`
    }).join('');
    gallery.insertAdjacentHTML('beforeend', galleryCardMarkup);
}