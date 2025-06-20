const params = new URLSearchParams(window.location.search);
const videoId = params.get("v");

if (videoId) {
  document.querySelector("title").innerHTML = videoId;
  const iframe = document.getElementById("youtube-player");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  // Fetch video details
  fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=AIzaSyCB9eucjB7iDg4XAVndE3rDdile8VOfc9w`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        const snippet = video.snippet;
        const stats = video.statistics;

        // Set title
        document.querySelector("h3").innerText = snippet.title;

        // Set views and date
        const views = Number(stats.viewCount).toLocaleString();
        const publishedDate = new Date(snippet.publishedAt).toDateString();
        document.querySelector(
          ".play-video-info p"
        ).innerText = `${views} views • ${publishedDate}`;

        // Set description
        document.querySelector(".vid-description details").innerText =
          snippet.description;

        // Set tags
        const tagsContainer = document.querySelector(".tags");
        if (snippet.tags && snippet.tags.length) {
          tagsContainer.innerHTML = snippet.tags
            .slice(0, 3)
            .map((tag) => `<a href="#">#${tag}</a>`)
            .join("");
        } else {
          tagsContainer.innerHTML = "";
        }

        // (Optional) Fetch and show channel data
        const channelId = snippet.channelId;
        fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=AIzaSyCB9eucjB7iDg4XAVndE3rDdile8VOfc9w`
        )
          .then((res) => res.json())
          .then((channelData) => {
            const channel = channelData.items[0];
            document.querySelector(".publisher p").innerText =
              channel.snippet.title;
            document.querySelector(".publisher span").innerText = `${Number(
              channel.statistics.subscriberCount
            ).toLocaleString()} subscribers`;
            document.querySelector(".publisher img").src =
              channel.snippet.thumbnails.default.url;
          });
      }
    })
    .catch((error) => {
      console.error("Error loading video info:", error);
    });
} else {
  document.querySelector(".video-container").innerHTML =
    "<p>Video ID not found.</p>";
}
const sidebar = document.querySelector(".right-sidebar");

const apiKey = "AIzaSyCB9eucjB7iDg4XAVndE3rDdile8VOfc9w";
const channelId = "UC0T6MVd3wQDB5ICAe45OxaQ"; // CodeWithHarry's channel ID
const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=10`;

fetch(apiUrl)
  .then((res) => res.json())
  .then((data) => {
    sidebar.innerHTML = ""; // Clear existing content

    data.items.forEach((video) => {
      if (!video.id.videoId) return; // Skip non-video items like playlists

      const title = video.snippet.title;
      const thumbnail = video.snippet.thumbnails.medium.url;
      const videoId = video.id.videoId;
      const channel = video.snippet.channelTitle;
      const publishedAt = new Date(
        video.snippet.publishedAt
      ).toLocaleDateString();

      const videoHTML = `
          <div class="side-video-list">
            <a href="play.html?videoId=${videoId}" class="small-thumbnail">
              <img src="${thumbnail}" alt="Thumbnail" />
            </a>
            <div class="vid-info">
              <a href="play.html?videoId=${videoId}">${title}</a>
              <p>${channel}</p>
              <p>Published: ${publishedAt}</p>
            </div>
          </div>
        `;
      sidebar.innerHTML += videoHTML;
    });
  })
  .catch((error) => {
    console.error("Error fetching videos:", error);
    sidebar.innerHTML = "<p>Failed to load videos.</p>";
  });

function checkTheme() {
  if (localStorage.getItem("isThemeToggled") === "true") {
    document.querySelector("nav").style.backgroundColor = "var(--dark-theme)";
    document.querySelectorAll("nav .icon").forEach((ele) => {
      ele.style.cssText = "filter:invert(1)";
    });
    document.querySelector(".container").style.backgroundColor =
      "var(--dark-theme-container)";
    document.querySelector(".play-video h3").style.color = "var(--light-theme)";
    document.querySelector(".publisher div").style.color = "var(--light-theme)";
    document.querySelectorAll(".vid-info a").forEach((ele) => {
      ele.style.color = "var(--dark-theme-text)";
    });
    document.querySelectorAll(".sidebar .icon").forEach((ele) => {
      ele.style.cssText = "filter:invert(1)";
    });
    document.body.style.backgroundColor = "var(--dark-theme-body)";
  } else {
    document.querySelector("nav").style.backgroundColor = "var(--light-theme)";
    document.querySelectorAll("nav .icon").forEach((ele) => {
      ele.style.cssText = "filter:invert(0)";
    });
    document.querySelector(".container").style.backgroundColor =
      "var(--light-theme-container)";
    document.querySelector(".sidebar").style.backgroundColor =
      "var(--light-theme)";
    document.querySelectorAll(".vid-info a").forEach((ele) => {
      ele.style.color = "var(--light-theme-text)";
    });
    document.querySelectorAll(".sidebar .icon").forEach((ele) => {
      ele.style.cssText = "filter:invert(0)";
    });
    document.body.style.backgroundColor = "var(--light-theme-body)";
  }
}

checkTheme();
