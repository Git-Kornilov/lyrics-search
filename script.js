"use strict";

const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

//More songs - with (cors herokuapp request)
const getMoreSongs = async function (url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);

  const data = await res.json();

  showData(data);
};

// Show term results in DOM
const showData = (data) => {
  result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          (song) => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join("")}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class='btn' onclick='getMoreSongs("${data.prev}")'>Prev</button>`
          : ""
      }
      ${
        data.next
          ? `<button class='btn' onclick='getMoreSongs("${data.next}")'>Next</button>`
          : ""
      }
    `;
  } else {
    more.innerHTML = "";
  }
};

// Search by words of song or artist
const searchSongs = async function (term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);

  const data = await res.json();

  showData(data);
};

// Get lyrics for song
const getLyrics = async function (artist, title) {
  const res = await fetch(`${apiURL}/v1/${artist}/${title}`);

  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `
  <h2><strong>${artist}</strong> - ${title}{</h2>
  <span>${lyrics}</span>
  `;

  more.innerHTML = "";
};

// addEventListener
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) alert("Please, type in a search term");
  if (searchTerm) searchSongs(searchTerm);

  search.value = "";
});

// Get lyrics button click
result.addEventListener("click", (e) => {
  const clickedEl = e.target;

  if (e.target.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-song-title");

    getLyrics(artist, songTitle);
  }
});
