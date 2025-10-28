const IMGFLIP_USERNAME = 'irako5';
const IMGFLIP_PASSWORD = '4Xh-CudVw&u%.T4';

let selectedTemplateId = null; // выбранный шаблон

async function loadMemes() {
    try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        const memes = data.data.memes;

        const container = document.getElementById('memesGrid');
        container.innerHTML = '';

        memes.forEach(meme => {
            const card = document.createElement('div');
            card.classList.add('meme-card');
            card.dataset.id = meme.id;

            const img = document.createElement('img');
            img.src = meme.url;
            img.alt = meme.name;

            const title = document.createElement('div');
            title.classList.add('meme-title');
            title.textContent = meme.name;

            card.appendChild(img);
            card.appendChild(title);
            container.appendChild(card);

            card.addEventListener('click', () => {
                document.querySelectorAll('.meme-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedTemplateId = meme.id;

                const createButton = document.querySelector('.create-button');
                createButton.classList.add('active');
                createButton.disabled = false;
            });
        });
    } catch (error) {
        console.error('Ошибка при загрузке мемов:', error);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const memesGrid = document.getElementById('memesGrid');

    const notFoundMessage = document.createElement('div');
    notFoundMessage.textContent = "Ничего не найдено";
    notFoundMessage.classList.add('not-found');
    memesGrid.parentNode.insertBefore(notFoundMessage, memesGrid.nextSibling);

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.meme-card');

        let anyVisible = false;

        cards.forEach(card => {
            const title = card.querySelector('.meme-title').textContent.toLowerCase();
            if (title.includes(searchText)) {
                card.classList.remove('hidden');
                anyVisible = true;
            } else {
                card.classList.add('hidden');
            }
        });
        notFoundMessage.classList.toggle('visible', !anyVisible);
    });
}

async function createMeme(templateId, text0, text1) {
    try {
        const formData = new URLSearchParams();
        formData.append('template_id', templateId);
        formData.append('username', IMGFLIP_USERNAME);
        formData.append('password', IMGFLIP_PASSWORD);
        formData.append('text0', text0);
        formData.append('text1', text1);

        const response = await fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            showCreatedMeme(data.data.url);
        } else {
            alert('Ошибка при создании мема: ' + data.error_message);
        }
    } catch (error) {
        console.error('Ошибка при создании мема:', error);
    }
}

function showCreatedMeme(url) {
    const resultDiv = document.getElementById('createdMeme');
    resultDiv.innerHTML = `<h3>Ваш мем:</h3><img src="${url}" alt="Created Meme"/>`;
}

function setupCreateButton() {
    const button = document.querySelector('.create-button');
    const modal = document.getElementById('memeModal');
    const closeButton = document.querySelector('.close-button');
    const form = document.getElementById('memeForm');

    button.disabled = true;

    button.addEventListener('click', () => {
        if (!selectedTemplateId) return;
        modal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        form.reset();
        document.getElementById('createdMeme').innerHTML = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            form.reset();
            document.getElementById('createdMeme').innerHTML = '';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text0 = document.getElementById('text0').value;
        const text1 = document.getElementById('text1').value;
        await createMeme(selectedTemplateId, text0, text1);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadMemes();
    setupSearch();
    setupCreateButton();
});
