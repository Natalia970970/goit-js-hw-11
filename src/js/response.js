import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30777543-e493bf0203eb427eb0034605d';


export function search (searchValue, page, perPage) {
    return axios.get(`${BASE_URL}?key=${KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
}
