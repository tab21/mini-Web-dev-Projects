import {
	ENDPOINT,
	getItemFromLocalStorage,
	logout,
	SECTIONTYPE,
	LOADED_TRACKS,
	setItemInLocalStorage,
	NOW_PLAYING,
} from "../common";
import { fetchRequest } from "../api";

// need a single audio
const audio = new Audio();
let displayName;

const loadProfile = () => {
	return new Promise(async (resolve, reject) => {
		const userProfileName = document.getElementById("display-name");
		const userProfileImage = document.getElementById("default-image");
		const userProfileBtn = document.getElementById("user-profile-btn");
		const { display_name, images } = await fetchRequest(ENDPOINT.userInfo);

		//profile name
		userProfileName.textContent = display_name;
		displayName = display_name;

		// default profile image
		if (images?.length) {
			userProfileImage.classList.add("hidden");
		} else {
			userProfileImage.classList.remove("hidden");
		}

		//profile click
		userProfileBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			const profileMenu = document.getElementById("profile-menu");
			profileMenu.classList.toggle("hidden");
			if (!profileMenu.classList.contains("hidden")) {
				const menuLogout = document.getElementById("logout");
				menuLogout.addEventListener("click", logout);
			}
		});

		resolve({ displayName, images });
	});
};

//playlist items click
const onPlaylistItemClick = (e, id) => {
	const section = { type: SECTIONTYPE.playlist, id: id };
	history.pushState(section, "", `playlist/${id}`);
	loadMain(section);
};

// to load playlist items
const loadPlaylistItems = async (ele_id, endpoint) => {
	const playlistSect = document.getElementById(ele_id);

	const {
		playlists: { items },
	} = await fetchRequest(endpoint);

	for (let {
		name,
		description,
		images: [{ url }],
		id,
	} of items) {
		const playlistItem = document.createElement("div");
		playlistItem.className =
			"rounded-lg bg-darker hover:bg-light-black p-4 hover:cursor-pointer";
		playlistItem.id = id;
		playlistItem.setAttribute("data-type", "playlist");

		playlistItem.innerHTML = `<img src=${url} alt=${name} class="rounded object-contain shadow"/>
		<h3 class="py-2 text-md truncate">${name}</h3>
		<p class="text-grey text-sm line-clamp-2"> ${description}</p>
	`;

		playlistSect.appendChild(playlistItem);
		playlistItem.addEventListener("click", (e) => {
			onPlaylistItemClick(e, id);
		});
	}
};

// to load playlists
const loadPlaylists = () => {
	loadPlaylistItems("featured-playlist", ENDPOINT.featuredPlaylist);
	loadPlaylistItems("toplist-playlist", ENDPOINT.toplists);
};

// to load playlist sections on dashboard
const fillDashboard = () => {
	// dashboard header
	const headerGradient = document.getElementById("gradient");
	headerGradient.innerHTML = `<hi class="text-4xl">Hi ${displayName}</h1>`;

	// main dashboard
	const mainElement = document.getElementById("playlists-sections");
	const playlistMap = new Map([
		["featured playlists", "featured-playlist"],
		["top playlists", "toplist-playlist"],
	]);
	mainElement.innerHTML = "";
	for (let [type, id] of playlistMap) {
		mainElement.innerHTML += `<section class="p-2">
		<h2 class="my-2 text-xl uppercase">${type}</h2>
		<section
			id=${id}
			class="grid grid-cols-auto-fill-cards gap-5"
		></section>
	</section>`;
	}
	loadPlaylists();
};

const formatTime = (duration) => {
	const min = Math.floor(duration / 60);
	const sec = (duration % 60).toFixed(0);

	const Time = sec === 60 ? min + 1 : min + ":" + (sec < 10 ? "0" : "") + sec;
	return Time;
};

//for track selection when clicked
const onTrackSelection = (id) => {
	document.querySelectorAll("#tracks .track").forEach((trackItem) => {
		if (trackItem.id === id) {
			trackItem.classList.add("bg-light-black", "selected");
		} else {
			trackItem.classList.remove("bg-light-black", "selected");
		}
	});
};

const updateToPlayMode = (id) => {
	const playButtonAudio = document.getElementById("play");

	playButtonAudio.querySelector("span").textContent = "pause_circle";
};

const updateToPauseMode = (id) => {
	const playButtonAudio = document.getElementById("play");

	playButtonAudio.querySelector("span").textContent = "play_circle";
};

//for Audio data in footer
const onAudioLoad = () => {
	const songDuration = document.getElementById("total-song-duration");
	songDuration.textContent = formatTime(audio.duration);
};

// to play track in the footer
const onPlayTrack = (
	event,
	{ image, artistNames, name, duration, previewUrl, id }
) => {
	if (event?.stopPropagation) {
		event.stopPropagation();
	}

	if (audio.src == previewUrl) {
		togglePlay();
	} else {
		setNowPlayingInfo({ image, id, name, artistNames });
		audio.src = previewUrl;
		audio.play();
	}
};

const setNowPlayingInfo = ({ image, id, name, artistNames }) => {
	const nowPlayingImg = document.getElementById("now-playing-image");
	nowPlayingImg.src = image.url;

	const nowPlayingTitle = document.getElementById("now-playing-song");
	nowPlayingTitle.textContent = name;

	const nowPlayingArtists = document.getElementById("now-playing-artists");
	nowPlayingArtists.textContent = artistNames;

	const audioControl = document.querySelector("#audio-control");
	audioControl.setAttribute("data-track-id", id);

	const songInfo = document.getElementById("song-info");
	songInfo.classList.remove("invisible");
};

// to load the tracks in playlist
const loadPlaylistTracks = ({ tracks }) => {
	const trackSections = document.querySelector("#tracks");
	let trackNo = 1;
	const loadedTracks = [];
	for (let trackItem of tracks.items.filter(
		(item) => item.track.preview_url
	)) {
		let {
			id,
			artists,
			name,
			album,
			duration_ms: duration,
			preview_url: previewUrl,
		} = trackItem.track;
		let track = document.createElement("section");
		track.id = id;
		track.className =
			"track p-1 grid grid-cols-[2rem_1fr_1fr_4rem] items-center justify-items-start gap-x-4 rounded-md hover:bg-light-black py-2";
		let image = album.images.find((img) => img.height === 64);
		let artistNames = Array.from(artists, (artist) => artist.name).join(
			", "
		);
		track.innerHTML = `
			<p class="relative w-full flex items-center justify-center justify-self-center -z-[1]">
				<span class="track-no ">${trackNo++}</span>
			</p>
			<section class="grid grid-cols-[auto_1fr] items-center gap-x-2">
				<img class="h-10 w-10" src="${image.url}" alt="${name}" />
				<article class="flex flex-col gap-x-2 justify-center">
					<h2 class="text-base text-swhite line-clamp-1 song-title">${name}</h2>
					<p class="text-xs line-clamp-1">${artistNames}</p>
				</article>
			</section>
			<p class="text-sm line-clamp-1">${album.name}</p>
			<p class="text-sm flex items-center justify-center justify-self-center line-clamp-1">${formatTime(
				duration / 1000
			)}</p>
			`;

		track.addEventListener("click", (event) => {
			onTrackSelection(id);
			onPlayTrack(event, {
				image,
				artistNames,
				name,
				duration,
				previewUrl,
				id,
			});
		});

		const playButton = document.createElement("button");
		playButton.id = `play-track-${id}`;
		playButton.className = `play w-full absolute left-0 text-lg invisible material-symbols-outlined`;
		playButton.textContent = "⏯️";

		track.querySelector("p").appendChild(playButton);
		trackSections.appendChild(track);

		loadedTracks.push({
			id,
			artists,
			name,
			album,
			duration,
			previewUrl,
			artistNames,
			image,
		});
	}

	setItemInLocalStorage(LOADED_TRACKS, loadedTracks);
};

// fill playlist content
const fillPlaylists = async (playlistId) => {
	const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);

	const { name, description, images, tracks } = playlist;
	const coverElement = document.querySelector("#gradient");
	coverElement.innerHTML = `
			<img  class="object-contain w-36 h-36" src="${images[0].url}" alt="${name}" />
			<section class="flex flex-col">
				<h2 id="playlist-name" class="text-4xl font-bold">${name}</h2>
				<p id="playlist-details" class="text-xl">${description} songs</p>
				<p id="playlist-details" class="text-base">${tracks.items.length} songs</p>
			</section>
	`;
	const pageContent = document.querySelector("#playlists-sections");
	pageContent.innerHTML = `
	<header id="playlist-header" class="mx-8 text-swhite border-dark-grey border-b-[0.5px] ">
					<nav class="py-2">
						<ul class="grid grid-cols-[2rem_1fr_1fr_4rem] gap-x-4 text-dark-grey">
							<li class="justify-self-center">#</li>
							<li>Title</li>
							<li>Album</li>
							<li class="material-symbols-outlined justify-self-center">⏲️</li>
						</ul>
					</nav>
	</header>
	<section class="px-8 text-grey mt-4" id="tracks">
	</section>
	`;

	loadPlaylistTracks(playlist);
};

const onScroll = (event) => {
	const { scrollTop } = event.target;
	const header = document.querySelector("#header");
	const coverElement = document.querySelector("#gradient");
	const nav = document.querySelector("#navbar");

	if (scrollTop >= nav.offsetHeight) {
		coverElement.classList.add("hidden");
	} else {
		coverElement.classList.remove("hidden");
	}

	if (history.state.type === SECTIONTYPE.playlist) {
		const playlistHeader = document.querySelector("#playlist-header");
		if (scrollTop >= nav.offsetHeight) {
			playlistHeader.classList.add("sticky", "bg-light-black");
			playlistHeader.style.top = `${
				nav.offsetHeight - header.offsetHeight
			}px`;
		} else {
			playlistHeader.classList.remove("sticky", "bg-light-black");
			playlistHeader.style.top = `revert`;
		}
	}
};

const findCurrentTrack = () => {
	const audioControl = document.querySelector("#audio-control");
	const trackId = audioControl.getAttribute("data-track-id");
	if (trackId) {
		const loadedTracks = getItemFromLocalStorage(LOADED_TRACKS);
		const currentTrackIndex = loadedTracks?.findIndex(
			(track) => track.id === trackId
		);
		return { currentTrackIndex, tracks: loadedTracks };
	}
	return null;
};

const playPrevTrack = () => {
	const { currentTrackIndex = -1, tracks = null } = findCurrentTrack() ?? {};
	if (currentTrackIndex > 0) {
		const prevTrack = tracks[currentTrackIndex - 1];
		onPlayTrack(null, prevTrack);
	}
};

const playNextTrack = () => {
	const { currentTrackIndex = -1, tracks = null } = findCurrentTrack() ?? {};
	if (currentTrackIndex > -1 && currentTrackIndex < tracks?.length - 1) {
		const currentTrack = tracks[currentTrackIndex + 1];
		onPlayTrack(null, currentTrack);
	}
};

const togglePlay = () => {
	if (audio.src) {
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}
};

const loadUserPlaylist = async () => {
	const playlists = await fetchRequest(ENDPOINT.userPlaylist);

	const userPlaylist = document.querySelector("#user-playlists >ul");
	userPlaylist.innerHTML = "";
	for (let { name, id } of playlists.items) {
		const li = document.createElement("li");
		li.textContent = name;
		li.className = "cursor-pointer hover:text-swhite ";
		li.addEventListener("click", () => onUserPlaylistClick(id));
		userPlaylist.appendChild(li);
	}
};

const loadMain = (section) => {
	if (section.type === SECTIONTYPE.dashboard) {
		fillDashboard();
	} else if (section.type == SECTIONTYPE.playlist) {
		fillPlaylists(section.id);
	}
	document.querySelector("#main").removeEventListener("scroll", onScroll);
	document.querySelector("#main").addEventListener("scroll", onScroll);
};

document.addEventListener("DOMContentLoaded", async () => {
	const volume = document.querySelector("#volume");
	const playButton = document.querySelector("#play");
	const nextTrack = document.querySelector("#next");
	const prevTrack = document.querySelector("#prev");
	const songDurationCompleted = document.querySelector(
		"#song-duration-completed"
	);
	const songProgress = document.querySelector("#progress");
	const timeline = document.querySelector("#timeline");
	const audioControl = document.querySelector("#audio-control");
	let progressInterval;

	({ displayName } = await loadProfile());
	loadUserPlaylist();

	const section = { type: SECTIONTYPE.dashboard };
	history.pushState(section, "", "");
	loadMain(section);

	// to close profile menu if clicked elsewhere
	document.addEventListener("click", () => {
		const profileMenu = document.getElementById("profile-menu");
		if (!profileMenu.classList.contains("hidden")) {
			profileMenu.classList.add("hidden");
		}
	});

	audio.addEventListener("loadedmetadata", onAudioLoad);
	audio.addEventListener("play", () => {
		const selectedTrackId = audioControl.getAttribute("data-track-id");
		const tracks = document.querySelector("#tracks");
		const playingTrack = tracks?.querySelector(`section.playing`);
		const selectedTrack = tracks?.querySelector(
			`[id="${selectedTrackId}"]`
		);
		if (playingTrack?.id !== selectedTrack?.id) {
			playingTrack?.classList.remove("playing");
		}
		selectedTrack?.classList.add("playing");

		progressInterval = setInterval(() => {
			if (audio.paused) {
				return;
			}
			songDurationCompleted.textContent = `${
				audio.currentTime.toFixed(0) < 10
					? "0:0" + audio.currentTime.toFixed(0)
					: "0:" + audio.currentTime.toFixed(0)
			}`;
			songProgress.style.width = `${
				(audio.currentTime / audio.duration) * 100
			}%`;
		}, 100);
		updateToPlayMode(selectedTrackId);
	});

	audio.addEventListener("pause", () => {
		if (progressInterval) {
			clearInterval();
		}
		const selectedTrackId = audioControl.getAttribute("data-track-id");
		updateToPauseMode(selectedTrackId);
	});

	window.addEventListener("popstate", (e) => {
		loadMain(e.state);
	});

	// for volume and timeline in footer
	volume.addEventListener("change", () => {
		audio.volume = volume.value / 100;
	});

	timeline.addEventListener(
		"click",
		(e) => {
			const timelineWidth = window.getComputedStyle(timeline).width;
			const timeToSeek =
				(e.offsetX / parseInt(timelineWidth)) * audio.duration;
			audio.currentTime = timeToSeek;
			songProgress.style.width = `${
				(audio.currentTime / audio.duration) * 100
			}%`;
		},
		false
	);

	playButton.addEventListener("click", togglePlay);
	prevTrack.addEventListener("click", playPrevTrack);
	nextTrack.addEventListener("click", playNextTrack);
});
