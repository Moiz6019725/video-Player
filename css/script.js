var menuIcon = document.querySelector(".menu-icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");

menuIcon.onclick = function () {
  sidebar.classList.toggle("small-sidebar");
  container.classList.toggle("large-container");
};

getYoutubePopularVideos();

async function getYoutubePopularVideos() {
  try {
    // Step 1: Fetch popular videos
    const videoResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=IN&maxResults=1000&key=AIzaSyCB9eucjB7iDg4XAVndE3rDdile8VOfc9w"
    );
    const videoData = await videoResponse.json();
    const videos = shuffle(videoData.items).slice(0, 50);

    // Step 2: Get unique channel IDs
    const channelIds = [...new Set(videos.map(v => v.snippet.channelId))];

    // Step 3: Fetch channel info
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(",")}&key=AIzaSyCB9eucjB7iDg4XAVndE3rDdile8VOfc9w`
    );
    const channelData = await channelResponse.json();

    // Step 4: Create map of channelId => channel thumbnail
    const channelThumbnails = {};
    channelData.items.forEach(channel => {
      channelThumbnails[channel.id] = channel.snippet.thumbnails.default.url;
    });

    // Step 5: Build HTML
    const container = document.querySelector(".list-container");
    const htmlList = videos.map(video => {
      const { title, channelTitle, thumbnails, publishedAt, channelId } = video.snippet;
      const { viewCount } = video.statistics;

      const thumbnailUrl = thumbnails.standard?.url || thumbnails.high?.url;
      const channelImage = channelThumbnails[channelId] || "images/default.jpg"; // fallback image
      const viewsFormatted = formatViews(viewCount);
      const timeAgo = timeSince(new Date(publishedAt));

      return `
        <div class="vid-list">
          <a href="watch.html?v=${video.id}"><img src="${thumbnailUrl}" class="thumbnail"/></a>
          <div class="flex-div">
            <img src="${channelImage}" alt="channel-icon"/>
            <div class="vid-info">
              <a href="watch.html?v=${video.id}">${title}</a>
              <p>${channelTitle}</p>
              <p>${viewsFormatted} Views &bull; ${timeAgo}</p>
            </div>
          </div>
        </div>`;
    });

    container.innerHTML = htmlList.join("");

  } catch (error) {
    console.error("Failed to fetch YouTube videos:", error);
  }
}


function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Helper to format large view counts
function formatViews(views) {
  if (views >= 1e9) return (views / 1e9).toFixed(1) + "B";
  if (views >= 1e6) return (views / 1e6).toFixed(1) + "M";
  if (views >= 1e3) return (views / 1e3).toFixed(1) + "K";
  return views;
}

// Helper to get time since publication
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year(s) ago";
  const months = Math.floor(seconds / 2592000);
  if (months >= 1) return months + " month(s) ago";
  const days = Math.floor(seconds / 86400);
  if (days >= 1) return days + " day(s) ago";
  const hours = Math.floor(seconds / 3600);
  if (hours >= 1) return hours + " hour(s) ago";
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 1) return minutes + " minute(s) ago";
  return "just now";
}


const cap_btn = document.querySelector(".capsule-btn");
let isToggle = false;

document.querySelector(".capsule").addEventListener("click", () => {
  isToggle = !isToggle;
  localStorage.setItem("isThemeToggled",isToggle)

  if (localStorage.getItem("isThemeToggled")==="true") {
    cap_btn.style.left = "unset";
    cap_btn.style.right = "2px";
    document.querySelector("nav").style.backgroundColor="var(--dark-theme)"
    document.querySelectorAll("nav .icon").forEach((ele)=>{
      ele.style.cssText="filter:invert(1)";
    })
    document.querySelector(".container").style.backgroundColor="var(--dark-theme-container)"
    document.querySelector(".sidebar").style.backgroundColor="var(--dark-theme-sidebar)"
    document.querySelectorAll(".vid-info a").forEach((ele)=>{
      ele.style.color="var(--dark-theme-text)"
    })
    document.querySelectorAll(".sidebar .icon").forEach((ele)=>{
      ele.style.cssText="filter:invert(1)";
    })
    document.body.style.backgroundColor="var(--dark-theme-body)"  
  } else {
    cap_btn.style.right = "unset";
    cap_btn.style.left = "2px";
    document.querySelector("nav").style.backgroundColor="var(--light-theme)"
    document.querySelectorAll("nav .icon").forEach((ele)=>{
      ele.style.cssText="filter:invert(0)";
    })
    document.querySelector(".container").style.backgroundColor="var(--light-theme-container)"
    document.querySelector(".sidebar").style.backgroundColor="var(--light-theme)"
    document.querySelectorAll(".vid-info a").forEach((ele)=>{
      ele.style.color="var(--light-theme-text)"
    })
    document.querySelectorAll(".sidebar .icon").forEach((ele)=>{
      ele.style.cssText="filter:invert(0)";
    })
    document.body.style.backgroundColor="var(--light-theme-body)"
  }
});